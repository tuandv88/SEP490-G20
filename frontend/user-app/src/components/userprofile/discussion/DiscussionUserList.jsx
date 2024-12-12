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
import { Search, Tag, Eye, ThumbsUp, MessageSquare, Bell, CheckCircle, AlertTriangle, AlertCircle, AlertOctagon, Trash2, Loader2 } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { motion } from 'framer-motion'

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
    const [showExplanation, setShowExplanation] = useState(false);

    const ViolationLevelsExplanation = () => (
        <div className="space-y-6">
            {Object.entries(violationLevels).map(([level, { text, icon: Icon, color }]) => (
                <div key={level} className={`flex items-start space-x-4 p-4 rounded-lg ${level === '1' ? 'bg-yellow-50' :
                    level === '2' ? 'bg-orange-50' :
                        'bg-red-50'
                    }`}>
                    <div className={`${level === '1' ? 'text-yellow-600 bg-yellow-200' :
                        level === '2' ? 'text-orange-600 bg-orange-200' :
                            'text-red-600 bg-red-200'
                        } p-2 rounded-full flex-shrink-0`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className={`font-semibold ${level === '1' ? 'text-yellow-800' :
                            level === '2' ? 'text-orange-800' :
                                'text-red-800'
                            }`}>{text}</h3>
                        <p className={`text-sm ${level === '1' ? 'text-yellow-700' :
                            level === '2' ? 'text-orange-700' :
                                'text-red-700'
                            }`}>
                            {level === '1' && "Minor infractions that don't severely impact the community. Examples include occasional use of inappropriate language or minor rule violations."}
                            {level === '2' && "More serious violations that negatively affect the community. Examples include repeated minor infractions, spreading misinformation, or engaging in heated arguments."}
                            {level === '3' && "Severe violations that significantly harm the community or individual members. Examples include hate speech, harassment, sharing explicit content, or any illegal activities."}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className={`p-6 rounded-lg border ${color}`}>
                <div className="flex items-center space-x-4 mb-4">
                    <Icon className="h-8 w-8" />
                    <h3 className="text-xl font-semibold">Violation Level: {text}</h3>
                </div>
                <p className="text-sm">
                    <span className="font-medium">Flagged Date:</span> {formatDate(violation.flaggedDate) || 'N/A'}
                </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-3">Reason:</h3>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{violation.reason || 'No reason provided'}</p>
            </div>
            <div className="mt-4">
                <Dialog open={showExplanation} onOpenChange={setShowExplanation}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            View Violation Levels Explanation
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Violation Levels Explanation</DialogTitle>
                        </DialogHeader>
                        <ViolationLevelsExplanation />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

const SelectedTags = ({ tags, onRemove }) => {
    return (
        <div className="flex flex-wrap gap-2 mt-3">
            {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="px-3 py-1.5 text-sm">
                    {tag}
                    <button onClick={() => onRemove(tag)} className="ml-2 text-xs font-bold hover:text-red-500">×</button>
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
    const [pageSize, setPageSize] = useState(5)
    const [searchKeyword, setSearchKeyword] = useState('')
    const [tags, setTags] = useState('')
    const [totalPages, setTotalPages] = useState(0)
    const [activeTab, setActiveTab] = useState('all')
    const [selectedTags, setSelectedTags] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '' });
    const [isLoading, setIsLoading] = useState(false)
    const [totalItems, setTotalItems] = useState(0);
    const [isFirstLoad, setIsFirstLoad] = useState(true);


    const fetchDiscussions = async () => {
        setIsLoading(true)
        try {
            const result = await DiscussApi.getDiscussionsByUserId(pageIndex, pageSize, searchKeyword, tags)
            if (result && result.discussionDetailUserDtos) {
                const { data, count } = result.discussionDetailUserDtos
                setDiscussions(data)
                setTotalItems(count)
                setTotalPages(Math.ceil(count / pageSize))
            } else {
                console.error('API returned invalid data')
            }
        } catch (error) {
            console.error('Error fetching discussions:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDiscussions();
    }, [pageIndex, pageSize]);

    useEffect(() => {
        if (!isFirstLoad) {
            const delayDebounceFn = setTimeout(() => {
                setPageIndex(1); // Reset page index when search or tags change
                fetchDiscussions();
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        } else {
            setIsFirstLoad(false);
        }
    }, [searchKeyword, tags, activeTab]);

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
        setTags(selectedTags.join(','));
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
        <div className="container mx-auto py-8">
            <Card className="bg-background shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold text-left text-gray-800">User Discussions</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 mb-6">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                    type="text"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    placeholder="Search discussions"
                                    className="w-full h-10 pl-10 pr-4 rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            <div className="flex flex-wrap items-center gap-2 p-2 border rounded-lg min-h-[40px]">
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
                            <TabsTrigger value="all" className="py-2">All</TabsTrigger>
                            <TabsTrigger value="active" className="py-2">Active</TabsTrigger>
                            <TabsTrigger value="inactive" className="py-2">Inactive</TabsTrigger>
                            <TabsTrigger value="flagged" className="py-2">Flagged</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : filteredDiscussions.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
                                <Table>
                                    <TableHeader className="bg-gray-100">
                                        <TableRow>
                                            <TableHead className="w-[200px] min-w-[200px] py-3 text-gray-700 font-semibold">Title</TableHead>
                                            <TableHead className="w-[14%] text-center py-3 text-gray-700 font-semibold">Category</TableHead>
                                            <TableHead className="w-[14%] py-3 text-gray-700 font-semibold">Tags</TableHead>
                                            <TableHead className="w-[10%] text-center py-3 text-gray-700 font-semibold">Created</TableHead>
                                            <TableHead className="w-[7%] text-center py-3 text-gray-700 font-semibold">Views</TableHead>
                                            <TableHead className="w-[7%] text-center py-3 text-gray-700 font-semibold">Votes</TableHead>
                                            <TableHead className="w-[7%] text-center py-3 text-gray-700 font-semibold">Comments</TableHead>
                                            <TableHead className="w-[7%] text-center py-3 text-gray-700 font-semibold">Notify</TableHead>
                                            <TableHead className="w-[7%] text-center py-3 text-gray-700 font-semibold">Active</TableHead>
                                            <TableHead className="w-[9%] text-center py-3 text-gray-700 font-semibold">Flags</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredDiscussions.map((discussion, index) => (
                                            <motion.tr
                                                key={discussion.discussionId}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <TableCell className="font-medium py-3 px-4">
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
                                                <TableCell className="text-center py-3 px-4 text-sm">
                                                    <div className="truncate text-sm" title={discussion.nameCategory}>
                                                        {truncateText(discussion.nameCategory, 20)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3 px-4">
                                                    <div className="flex flex-wrap gap-1 justify-center">
                                                        {discussion.tags.slice(0, 2).map((tag, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant={selectedTags.includes(tag) ? "secondary" : "outline"}
                                                                className={`px-2 py-1 text-xs cursor-pointer transition-colors duration-200 w-20 text-center ${selectedTags.includes(tag)
                                                                    ? 'bg-[#3e79b2] text-white hover:bg-[#3e79b2]/80'
                                                                    : 'hover:bg-gray-100'
                                                                    }`}
                                                                onClick={() => handleTagClick(tag)}
                                                            >
                                                                <Tag className="mr-1 h-3 w-3" />
                                                                {truncateText(tag, 8)}
                                                            </Badge>
                                                        ))}
                                                        {discussion.tags.length > 2 && (
                                                            <Badge variant="outline" className="px-2 py-1 w-20 text-center text-xs">
                                                                +{discussion.tags.length - 2}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center py-3 px-4 text-sm">{formatRelativeDate(discussion.dateCreated)}</TableCell>
                                                <TableCell className="text-center py-3 px-4">
                                                    <div className="flex items-center justify-center">
                                                        <Eye className="mr-1 h-4 w-4" />
                                                        {discussion.viewCount}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center py-3 px-4">
                                                    <div className="flex items-center justify-center">
                                                        <ThumbsUp className="mr-1 h-4 w-4" />
                                                        {discussion.voteCount}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center py-3 px-4">
                                                    <div className="flex items-center justify-center">
                                                        <MessageSquare className="mr-1 h-4 w-4" />
                                                        {discussion.commentsCount}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center py-3 px-4">
                                                    {discussion.notificationsEnabled ? (
                                                        <Bell className="h-5 w-5 text-green-500 mx-auto" />
                                                    ) : (
                                                        <Bell className="h-5 w-5 text-gray-300 mx-auto" />
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center py-3 px-4">
                                                    {discussion.isActive ? (
                                                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                                                    ) : (
                                                        <CheckCircle className="h-5 w-5 text-gray-300 mx-auto" />
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center py-3 px-4">
                                                    {discussion.violationLevel === 0 ? (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="font-medium w-full h-full flex items-center justify-center space-x-1 bg-green-100 text-green-700 hover:bg-green-200"
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            <span>None</span>
                                                        </Button>
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
                                                            <DialogContent className="sm:max-w-[500px] p-6">
                                                                <DialogHeader>
                                                                    <DialogTitle className="text-2xl font-bold mb-4">Violation Details</DialogTitle>
                                                                </DialogHeader>
                                                                <ViolationDetails violation={discussion} />
                                                                <div className="mt-6 flex justify-end">
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="flex items-center rounded-md border-2 border-red-500 text-red-500 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-200 ease-in-out"
                                                                            >
                                                                                <Trash2 className="h-4 w-4 mr-2" />
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
                                                                                    className="bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-200 ease-in-out"
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
                                            </motion.tr>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </motion.div>
                    ) : (
                        <p className="text-center text-gray-500 py-6">No discussions found.</p>
                    )}

                    <div className="flex justify-center items-center space-x-2 mt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(1)}
                            disabled={pageIndex === 1 || isLoading}
                            className="text-[#3e79b2] border-[#3e79b2] hover:bg-[#3e79b2] hover:text-white"
                        >
                            First
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pageIndex - 1)}
                            disabled={pageIndex === 1 || isLoading}
                            className="text-[#3e79b2] border-[#3e79b2] hover:bg-[#3e79b2] hover:text-white"
                        >
                            Previous
                        </Button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNumber = pageIndex + i - Math.min(2, pageIndex - 1);
                            if (pageNumber > 0 && pageNumber <= totalPages) {
                                return (
                                    <Button
                                        key={pageNumber}
                                        variant={pageNumber === pageIndex ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(pageNumber)}
                                        disabled={isLoading}
                                        className={`${pageNumber === pageIndex
                                            ? 'bg-[#3e79b2] text-white'
                                            : 'text-[#3e79b2] border-[#3e79b2] hover:bg-[#3e79b2] hover:text-white'}`}
                                    >
                                        {pageNumber}
                                    </Button>
                                );
                            }
                            return null;
                        })}
                        {totalPages > 5 && pageIndex < totalPages - 2 && (
                            <span className="px-2 text-[#3e79b2]">...</span>
                        )}
                        {totalPages > 5 && pageIndex < totalPages - 1 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(totalPages)}
                                disabled={isLoading}
                                className="text-[#3e79b2] border-[#3e79b2] hover:bg-[#3e79b2] hover:text-white"
                            >
                                {totalPages}
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pageIndex + 1)}
                            disabled={pageIndex === totalPages || isLoading}
                            className="text-[#3e79b2] border-[#3e79b2] hover:bg-[#3e79b2] hover:text-white"
                        >
                            Next
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(totalPages)}
                            disabled={pageIndex === totalPages || isLoading}
                            className="text-[#3e79b2] border-[#3e79b2] hover:bg-[#3e79b2] hover:text-white"
                        >
                            Last
                        </Button>
                    </div>
                    <div className="text-sm text-gray-500 mt-4 text-center">
                        Showing {Math.min((pageIndex - 1) * pageSize + 1, totalItems)} - {Math.min(pageIndex * pageSize, totalItems)} of {totalItems} items
                    </div>
                </CardContent>
            </Card>
            {toast.show && (
                <Stack
                    sx={{
                        position: 'fixed',
                        top: 20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 9999,
                        width: 'auto',
                        maxWidth: '500px',
                    }}
                >
                    <Alert severity="success" className="shadow-lg">
                        {toast.message}
                    </Alert>
                </Stack>
            )}
        </div>
    )
}

export default DiscussionUserList

