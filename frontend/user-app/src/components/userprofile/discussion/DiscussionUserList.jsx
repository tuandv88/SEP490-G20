import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DiscussApi } from '@/services/api/DiscussApi'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Search, Tag, Eye, ThumbsUp, MessageSquare, Bell, CheckCircle, AlertTriangle, AlertCircle, AlertOctagon, Trash2 } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

const ViolationDetails = ({ violation }) => {
    const violationLevels = {
        1: { text: 'Low', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: AlertCircle },
        2: { text: 'Medium', color: 'bg-orange-100 text-orange-800 border-orange-300', icon: AlertTriangle },
        3: { text: 'High', color: 'bg-red-100 text-red-800 border-red-300', icon: AlertOctagon }
    };

    const { text, color, icon: Icon } = violationLevels[violation.violationLevel];

    return (
        <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${color}`}>
                <div className="flex items-center space-x-3 mb-2">
                    <Icon className="h-6 w-6" />
                    <h3 className="text-lg font-semibold">Violation Level: {text}</h3>
                </div>
                <p className="text-sm">
                    <span className="font-medium">Flagged Date:</span> {formatDate(violation.flaggedDate) || 'N/A'}
                </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-md font-semibold mb-2">Reason:</h3>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{violation.reason || 'No reason provided'}</p>
            </div>
        </div>
    )
}

const SelectedTags = ({ tags, onRemove }) => {
    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="px-2 py-1">
                    {tag}
                    <button onClick={() => onRemove(tag)} className="ml-2 text-xs font-bold">×</button>
                </Badge>
            ))}
        </div>
    );
};

const DiscussionUserList = () => {
    const navigate = useNavigate()
    const handleTitleClick = (discussionId) => {
        navigate(`/discussion/${discussionId}`)
    }
    const [discussions, setDiscussions] = useState([])
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(3)
    const [searchKeyword, setSearchKeyword] = useState('')
    const [tags, setTags] = useState('')
    const [totalPages, setTotalPages] = useState(0)
    const [activeTab, setActiveTab] = useState('all')
    const [selectedTags, setSelectedTags] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '' });

    const fetchDiscussions = async () => {
        try {
            const result = await DiscussApi.getDiscussionsByUserId(pageIndex, pageSize, searchKeyword, tags)
            if (result && result.discussionDetailUserDtos) {
                const { data, count } = result.discussionDetailUserDtos
                setDiscussions(data)
                setTotalPages(Math.ceil(count / pageSize))
            } else {
                console.error('API returned invalid data')
            }
        } catch (error) {
            console.error('Error fetching discussions:', error)
        }
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchDiscussions();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [pageIndex, pageSize, searchKeyword, tags])

    const handlePageChange = (newPage) => setPageIndex(newPage)

    const formatRelativeDate = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()

        const diffInTime = now - date
        const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24))
        const diffInHours = Math.floor(diffInTime / (1000 * 60 * 60))
        const diffInMinutes = Math.floor(diffInTime / (1000 * 60))

        if (diffInDays >= 7) {
            return formatDate(dateString)
        }

        if (diffInDays > 0) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
        }

        if (diffInHours > 0) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
        }

        if (diffInMinutes > 0) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
        }

        return 'Just now'
    }

    const handleTagClick = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    useEffect(() => {
        setTags(selectedTags.join(', '));
    }, [selectedTags]);

    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    const handleRemoveViolation = async (discussionId) => {
        try {
            await DiscussApi.removeDiscussionById({ discussionId });
            showToast("The discussion has been successfully deleted.");
            fetchDiscussions(); // Reload the discussions
        } catch (error) {
            console.error('Error removing discussion:', error);
            showToast("Failed to remove the discussion. Please try again.");
        }
    };

    const filteredDiscussions = discussions.filter(discussion => {
        if (activeTab === 'all') return true
        if (activeTab === 'active') return discussion.isActive
        if (activeTab === 'inactive') return !discussion.isActive
        if (activeTab === 'flagged') return discussion.violationLevel > 0
        return true
    })

    return (
        <div className="container mx-auto py-10">
            <Card className="bg-background">
                <CardHeader className="pb-4">
                    <CardTitle className="text-3xl font-bold text-center">User Discussions</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 mb-6">
                        <div className="flex-1">
                            <Input
                                type="text"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                placeholder="Search discussions"
                                className="w-full h-10"
                            />
                        </div>
                        <div className="flex-1 relative">
                            <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md min-h-[40px]">
                                {selectedTags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="px-2 py-1 text-sm">
                                        {tag}
                                        <button onClick={() => handleTagClick(tag)} className="ml-2 text-xs font-bold hover:text-red-500">×</button>
                                    </Badge>
                                ))}
                                <Input
                                    type="text"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder={selectedTags.length ? "" : "Tags (comma separated)"}
                                    className="flex-1 border-none p-0 text-sm focus:ring-0 h-8"
                                />
                            </div>
                        </div>
                    </div>

                    <Tabs defaultValue="all" className="mb-4" onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="active">Active</TabsTrigger>
                            <TabsTrigger value="inactive">Inactive</TabsTrigger>
                            <TabsTrigger value="flagged">Flagged</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {filteredDiscussions.length > 0 ? (
                        <div className="overflow-x-auto rounded-md border border-gray-200">
                            <Table>
                                <TableHeader className="bg-gray-100">
                                    <TableRow>
                                        <TableHead className="w-[200px] min-w-[200px]">Title</TableHead>
                                        <TableHead className="w-[14%] text-center">Category</TableHead>
                                        <TableHead className="w-[14%]">Flags</TableHead>
                                        <TableHead className="w-[10%] text-center">Created</TableHead>
                                        <TableHead className="w-[7%] text-center">Views</TableHead>
                                        <TableHead className="w-[7%] text-center">Votes</TableHead>
                                        <TableHead className="w-[7%] text-center">Comments</TableHead>
                                        <TableHead className="w-[7%] text-center">Notifications</TableHead>
                                        <TableHead className="w-[7%] text-center">Active</TableHead>
                                        <TableHead className="w-[9%] text-center">Violation</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDiscussions.map((discussion) => (
                                        <TableRow key={discussion.discussionId} className="hover:bg-gray-50 h-12">
                                            <TableCell className="font-medium py-2 px-3">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div
                                                                className="truncate cursor-pointer hover:text-primary transition-colors"
                                                                onClick={() => handleTitleClick(discussion.discussionId)}
                                                            >
                                                                {truncateText(discussion.title, 30)}
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>View Detail</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                            <TableCell className="text-center py-2 px-3 text-sm">
                                                <div className="truncate text-sm" title={discussion.nameCategory}>
                                                    {truncateText(discussion.nameCategory, 20)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-2 px-3">
                                                <div className="flex flex-wrap gap-1 justify-center">
                                                    {discussion.tags.slice(0, 2).map((tag, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant={selectedTags.includes(tag) ? "secondary" : "outline"}
                                                            className={`px-2 py-1 text-sm cursor-pointer transition-colors duration-200 ${selectedTags.includes(tag)
                                                                ? 'bg-primary text-primary-foreground hover:bg-primary/80'
                                                                : 'hover:bg-gray-100'
                                                                }`}
                                                            onClick={() => handleTagClick(tag)}
                                                        >
                                                            <Tag className="mr-1 h-3 w-3" />
                                                            {truncateText(tag, 8)}
                                                        </Badge>
                                                    ))}
                                                    {discussion.tags.length > 2 && (
                                                        <Badge variant="outline" className="px-2 py-0.5">
                                                            +{discussion.tags.length - 2}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center py-2 px-3 text-sm">{formatRelativeDate(discussion.dateCreated)}</TableCell>
                                            <TableCell className="text-center py-2 px-3">
                                                <div className="flex items-center justify-center">
                                                    <Eye className="mr-1 h-4 w-4" />
                                                    {discussion.viewCount}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center py-2 px-3">
                                                <div className="flex items-center justify-center">
                                                    <ThumbsUp className="mr-1 h-4 w-4" />
                                                    {discussion.voteCount}
                                                </div>
                                            </TableCell>
                                            <TableCell classNameTableCell className="text-center py-2 px-3">
                                                <div className="flex items-center justify-center">
                                                    <MessageSquare className="mr-1 h-4 w-4" />
                                                    {discussion.commentsCount}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center py-2 px-3">
                                                {discussion.notificationsEnabled ? (
                                                    <Bell className="h-4 w-4 text-green-500 mx-auto" />
                                                ) : (
                                                    <Bell className="h-4 w-4 text-gray-300 mx-auto" />
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center py-2 px-3">
                                                {discussion.isActive ? (
                                                    <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                                                ) : (
                                                    <CheckCircle className="h-4 w-4 text-gray-300 mx-auto" />
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center py-2 px-3">
                                                {discussion.violationLevel === 0 ? (
                                                    <span className="text-green-500 font-medium">None</span>
                                                ) : (
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className={`font-medium w-full h-full flex items-center justify-center space-x-1 ${discussion.violationLevel === 1
                                                                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                                    : discussion.violationLevel === 2
                                                                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                                    }`}
                                                            >
                                                                {discussion.violationLevel === 1 ? (
                                                                    <AlertCircle className="h-4 w-4 mr-1" />
                                                                ) : discussion.violationLevel === 2 ? (
                                                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                                                ) : (
                                                                    <AlertOctagon className="h-4 w-4 mr-1" />
                                                                )}
                                                                <span>{discussion.violationLevel === 1 ? 'Low' : discussion.violationLevel === 2 ? 'Medium' : 'High'}</span>
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[450px] p-4">
                                                            <DialogHeader>
                                                                <DialogTitle className="text-2xl font-bold mb-2">Violation Details</DialogTitle>
                                                            </DialogHeader>
                                                            <ViolationDetails violation={discussion} />
                                                            <div className="mt-4 flex justify-end">
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            style={{ borderWidth: '1.5px' }}
                                                                            className="flex items-center rounded-md border-1 border-red-500 text-red-500 hover:bg-red-100 hover:text-red-600 focus:outlinefocus:ring-1 focus:ring-red-600 transition duration-200 ease-in-out"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                            Remove
                                                                        </Button>


                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This action cannot be undone. This will permanently delete the discussion.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => handleRemoveViolation(discussion.discussionId)}
                                                                                style={{ borderWidth: '1.5px' }}
                                                                                variant="outline"
                                                                                className="bg-red-10 text-red-500 border-1 border-red-500 rounded-md hover:bg-red-200 hover:text-red-500 focus:outline focus:ring-1 focus:ring-red-500 transition duration-200 ease-in-out"
                                                                            >
                                                                                Remove
                                                                            </AlertDialogAction>

                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No discussions found.</p>
                    )}

                    <div className="flex justify-center space-x-2 mt-4">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={page === pageIndex ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
            {toast.show && (
                <Stack
                    sx={{
                        position: 'fixed',
                        top: 20, // Đặt cách từ đầu trang một chút
                        left: '50%', // Căn giữa theo chiều ngang
                        transform: 'translateX(-50%)', // Đảm bảo căn giữa tuyệt đối
                        zIndex: 9999, // Đảm bảo thông báo hiển thị trên tất cả các phần tử khác
                        width: 'auto', // Giới hạn chiều rộng thông báo
                        maxWidth: '500px', // Giới hạn chiều rộng tối đa cho thông báo
                    }}
                >
                    <Alert severity="error">
                        Remove Discussion Successfully!
                    </Alert>
                </Stack>
            )}
        </div>
    )
}

export default DiscussionUserList

