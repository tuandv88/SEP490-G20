'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Upload, Download } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import * as XLSX from 'xlsx'
import { useToast } from '@/hooks/use-toast'

const TestCaseGenerator = ({ testCases, setTestCases }) => {
  const { toast } = useToast()
  const [params, setParams] = useState([])
  const [newParam, setNewParam] = useState('')
  const [previewInput, setPreviewInput] = useState('')
  const [previewOutput, setPreviewOutput] = useState('')

  const addParam = () => {
    if (newParam && !params.includes(newParam)) {
      setParams([...params, newParam])
      setNewParam('')
    }
  }

  const removeParam = (param) => {
    setParams(params.filter((p) => p !== param))
    setTestCases(
      testCases.map((testCase) => {
        const { [param]: removed, ...rest } = testCase
        return rest
      })
    )
  }

  const createTestCase = () => {
    const newTestCase = params.reduce((acc, param) => {
      acc[param] = ''
      return acc
    }, {})
    setTestCases([...testCases, { ...newTestCase, expectedOutput: 'N/A', isHidden: false }])
  }

  const updateTestCaseValue = (testCaseIndex, param, value) => {
    const updatedTestCases = [...testCases]
    updatedTestCases[testCaseIndex][param] = value
    setTestCases(updatedTestCases)
  }

  const updateExpectedOutput = (testCaseIndex, value) => {
    const updatedTestCases = [...testCases]
    updatedTestCases[testCaseIndex].expectedOutput = value
    setTestCases(updatedTestCases)
  }

  const removeTestCase = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index))
  }

  const toggleTestCaseHidden = (index) => {
    const updatedTestCases = [...testCases]
    updatedTestCases[index].isHidden = !updatedTestCases[index].isHidden
    setTestCases(updatedTestCases)
  }

  useEffect(() => {
    // Update Preview Input
    const input = testCases.flatMap((testCase) => params.map((param) => `${testCase[param]}`)).join('\n')
    setPreviewInput(input)

    // Update Preview Output
    const output = JSON.stringify(
      testCases.map((testCase) => ({
        Output: testCase.expectedOutput,
        Stdout: ''
      })),
      null,
      2
    )
    setPreviewOutput(output)
  }, [testCases, params])

  const createTestCaseNoParam = () => {
    setTestCases([...testCases, { expectedOutput: '', isHidden: false }])
  }

  const fileInputRef = React.useRef(null);

  const handleImportClick = () => {
    // Reset giá trị của input file trước khi mở dialog chọn file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    fileInputRef.current?.click();
  };

  const handleImportExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Kiểm tra định dạng file
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls'].includes(fileExtension)) {
      toast({
        variant: "destructive",
        title: "Import failed", 
        description: "Invalid file format",
      });
      // Reset input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const data = XLSX.utils.sheet_to_json(worksheet, { 
          defval: '', // Giá trị mặc định cho ô trống
          raw: false  // Chuyển đổi tất cả giá trị thành chuỗi
        })

        if (data.length === 0) {
          toast({
            variant: "destructive",
            title: "Import failed",
            description: "Excel file is empty",
          })
          return;
        }

        // Lấy tất cả các cột từ file Excel
        const excelColumns = Object.keys(data[0]);

        // Kiểm tra xem có ít nhất một cột Input_ không
        const hasInputColumns = excelColumns.some(key => 
          key.toLowerCase().startsWith('input_')
        );

        // Kiểm tra cột Expected (không phân biệt hoa thường)
        const hasExpectedColumn = excelColumns.some(key => 
          key.toLowerCase() === 'expected'
        );

        // Thêm kiểm tra cột IsHidden
        const hasIsHiddenColumn = excelColumns.some(key => 
          key.toLowerCase() === 'ishidden'
        );

        // Kiểm tra các cột bắt buộc
        if (!hasInputColumns || !hasIsHiddenColumn) {
          let missingColumns = [];
          if (!hasInputColumns) missingColumns.push("Input_*");
          if (!hasIsHiddenColumn) missingColumns.push("IsHidden");
          
          toast({
            variant: "destructive",
            title: "Import failed",
            description: `File is not in the correct format. Required columns: ${missingColumns.join(', ')}`,
          })
          return;
        }

        // Lấy tất cả các params từ headers của Excel
        const excelParams = Object.keys(data[0])
          .filter(key => key.toLowerCase().startsWith('input_'))
          .map(key => key.substring(6)); // Lấy phần sau "Input_"

        // Validate và xử lý từng dòng dữ liệu
        const newTestCases = [];
        
        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          const testCase = {};
          
          // Khởi tạo tất cả các input params với giá trị rỗng
          excelParams.forEach(paramName => {
            testCase[paramName] = '';
          });
          
          // Xử lý các cột Input
          Object.keys(row).forEach(key => {
            if (key.toLowerCase() === 'testcaseid') return;

            if (key.toLowerCase().startsWith('input_')) {
              const paramName = key.substring(6); // Lấy phần sau "Input_"
              testCase[paramName] = row[key];  // Lưu với tên param đã cắt bỏ "Input_"
            }
            else if (key.toLowerCase() === 'expected') {
              testCase.expectedOutput = row[key];
            }
            else if (key.toLowerCase() === 'ishidden') {
              const value = row[key];
              testCase.isHidden = value === true || 
                                 value === 'TRUE' || 
                                 value === 'true' || 
                                 value === 1 || 
                                 value === '1';
            }
          });

          newTestCases.push(testCase);
        }

        // Cập nhật params và test cases
        const updatedParams = [...new Set([...params, ...excelParams])];
        setParams(updatedParams);
        setTestCases([...testCases, ...newTestCases]);
        
        toast({
          title: "Import successful",
          description: `Imported ${newTestCases.length} test cases`
        });
        event.target.value = '';

      } catch (error) {
        console.error('Import error:', error);
        toast({
          variant: "destructive",
          title: "Import failed",
          description: "Error reading Excel file. Please check the file format",
        });
      } finally {
        // Reset input file trong mọi trường hợp
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      toast({
        variant: "destructive",
        title: "Import failed",
        description: "Error reading file",
      });
      // Reset input file khi có lỗi
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    // Tạo workbook mới
    const wb = XLSX.utils.book_new();
    
    // Tạo dữ liệu mẫu
    const templateData = [
      {
        TestCaseId: 1,
        Input_param1: "value1",
        Input_param2: "value2", 
        Expected: "expected output",
        IsHidden: false
      },
      {
        TestCaseId: 2,
        Input_param1: "value3",
        Input_param2: "value4",
        Expected: "expected output 2", 
        IsHidden: true
      }
    ];

    // Chuyển đổi dữ liệu thành worksheet
    const ws = XLSX.utils.json_to_sheet(templateData);
    
    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, "Template");

    // Tải xuống file
    XLSX.writeFile(wb, "testcase_template.xlsx");
  };

  return (
    <Card className='w-full mx-auto'>
      <div className='flex justify-center'>
        <CardHeader>
          <CardTitle className='text-center text-2xl font-semibold'>Test Case Generator</CardTitle>
        </CardHeader>
      </div>
      <CardFooter className='flex flex-col items-stretch gap-4'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          <div
            className={`col-span-1 lg:col-span-2 ${
              testCases.length === 0
                ? 'rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center min-h-[200px]'
                : 'grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[800px] overflow-y-auto pr-2'
            }`}
          >
            {testCases.length === 0 && (
              <p className='text-center text-gray-500 w-full font-semibold'>
                No test cases created yet.
              </p>
            )}
            {testCases.map((testCase, testCaseIndex) => (
              <Card key={testCaseIndex} className='w-full mb-4'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-semibold'>Test Case {testCaseIndex + 1}</CardTitle>
                  <div className='flex items-center space-x-2'>
                    <div className='flex items-center space-x-2'>
                      <Label htmlFor={`hidden-toggle-${testCaseIndex}`}>Hidden</Label>
                      <Switch
                        id={`hidden-toggle-${testCaseIndex}`}
                        checked={testCase.isHidden}
                        onCheckedChange={() => toggleTestCaseHidden(testCaseIndex)}
                      />
                    </div>
                    <Button variant='ghost' size='sm' type='button' onClick={() => removeTestCase(testCaseIndex)}>
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {Object.entries(testCase).map(
                    ([param, value]) =>
                      param !== 'expectedOutput' &&
                      param !== 'isHidden' && (
                        <div key={param} className='flex items-center gap-2 mb-2'>
                          <Label htmlFor={`${testCaseIndex}-${param}`} className='w-1/3'>
                            <Badge variant='outline' className='mr-2'>
                              {param}
                            </Badge>
                          </Label>
                          <Input
                            id={`${testCaseIndex}-${param}`}
                            value={value}
                            onChange={(e) => updateTestCaseValue(testCaseIndex, param, e.target.value)}
                            className='w-2/3'
                          />
                        </div>
                      )
                  )}
                  <div className='flex items-center gap-2 mb-2'>
                    <Label htmlFor={`${testCaseIndex}-expectedOutput`} className='w-1/3'>
                      <Badge variant='outline' className='mr-2'>
                        Expected Output
                      </Badge>
                    </Label>
                    <Input
                      id={`${testCaseIndex}-expectedOutput`}
                      value={testCase.expectedOutput}
                      onChange={(e) => updateExpectedOutput(testCaseIndex, e.target.value)}
                      className='w-2/3'
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className='col-span-1 flex flex-col gap-4'>
            <Card className='w-full'>
              <CardContent className='space-y-4'>
                <div className='flex flex-col gap-2'>
                  <Input
                    className='mt-5'
                    placeholder='Enter parameter name'
                    value={newParam}
                    onChange={(e) => setNewParam(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addParam()
                      }
                    }}
                  />
                  <Button type='button' onClick={addParam} className='flex-shrink-0'>
                    <Plus className='w-4 h-4 mr-2' />
                    Add Param
                  </Button>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {params.map((param) => (
                    <div key={param} className='flex items-center bg-gray-100 rounded-full px-3 py-1'>
                      <span>{param}</span>
                      <Button variant='ghost' size='sm' className='ml-2 p-0 h-auto' onClick={() => removeParam(param)}>
                        <X className='w-4 h-4' />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className='flex flex-col gap-2'>
                <Button 
                  type='button' 
                  onClick={createTestCase} 
                  disabled={params.length === 0} 
                  className='w-full'
                >
                  Create Test Case
                </Button>
                <Button 
                  type='button' 
                  onClick={createTestCaseNoParam} 
                  className='w-full'
                >
                  Create No Parameters
                </Button>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImportExcel}
                />
                <Button 
                  type='button' 
                  variant='outline'
                  className='w-full'
                  onClick={handleImportClick}
                >
                  <Upload className='w-4 h-4 mr-2' />
                  Import Excel
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='w-full'
                  onClick={downloadTemplate}
                >
                  <Download className='w-4 h-4 mr-2' />
                  Template
                </Button>
              </CardFooter>
            </Card>
            <Card className='w-full'>
              <CardHeader>
                <CardTitle>Preview Input</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea value={previewInput} readOnly className='w-full h-40' />
              </CardContent>
            </Card>
            <Card className='w-full'>
              <CardHeader>
                <CardTitle>Preview Output</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea value={previewOutput} readOnly className='w-full h-40' />
              </CardContent>
            </Card>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default React.memo(TestCaseGenerator)
