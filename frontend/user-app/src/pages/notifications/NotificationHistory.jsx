import React, { useEffect, useState, useRef, useCallback } from 'react'
import { NotificationApi } from "@/services/api/notificationApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, Clock, AlertCircle, Layout } from 'lucide-react'
import LayoutComponent from "@/layouts/layout";

function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center h-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
}

function timeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffInMs = now.getTime() - past.getTime();

    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} minutes ago`;
    return `${seconds} seconds ago`;
}

export default function NotificationHistory() {
    const [notificationHistories, setNotificationHistories] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 5,
        totalCount: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    const lastNotificationElementRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPagination(prevPagination => ({
                    ...prevPagination,
                    pageIndex: prevPagination.pageIndex + 1,
                }));
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const fetchNotificationHistories = useCallback(async () => {
        if (!hasMore) return;

        setLoading(true);
        setError(null);

        try {
            const response = await NotificationApi.getNotificationHistoriesByIdUserCurrent({
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
            });

            if (response && response.updatedNotificationHistories) {
                setNotificationHistories(prevHistories => [
                    ...prevHistories,
                    ...response.updatedNotificationHistories,
                ]);

                const newPagination = response.pagination || pagination;
                setPagination(newPagination);
                setHasMore(newPagination.pageIndex * newPagination.pageSize < newPagination.totalCount);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            setError('An error occurred while loading data!');
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [pagination.pageIndex, pagination.pageSize, hasMore]);

    useEffect(() => {
        fetchNotificationHistories();
    }, [fetchNotificationHistories]);

    return (
        <LayoutComponent>
            <div className="container mx-auto px-4 py-8 max-w-3xl h-screen flex items-center justify-center mt-16 ">
                <Card className="bg-background shadow-lg rounded-lg overflow-hidden flex flex-col w-full h-[90vh]">
                    <CardHeader className="bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground p-6 flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold flex items-center">
                                <Bell className="mr-2" />
                                Notifications
                            </CardTitle>
                            <Badge variant="secondary" className="text-sm bg-primary-foreground text-primary">
                                {notificationHistories.length} New
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-grow overflow-hidden">
                        <div className="h-full overflow-y-auto scrollbar-hide">
                            {notificationHistories.length === 0 && !loading ? (
                                <p className="text-center text-muted-foreground p-6">No notifications available.</p>
                            ) : (
                                notificationHistories.map((notification, index) => (
                                    <div
                                        key={notification.id}
                                        ref={index === notificationHistories.length - 1 ? lastNotificationElementRef : null}
                                        className={`border-b last:border-b-0 p-4 transition-all duration-300 ease-in-out hover:bg-accent ${notification.isRead ? "bg-background" : "bg-primary/5"}`}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className={`rounded-full p-2 flex-shrink-0 ${notification.isRead ? "bg-secondary" : "bg-primary"}`}>
                                                {notification.isRead ? (
                                                    <CheckCircle className="h-5 w-5 text-secondary-foreground" />
                                                ) : (
                                                    <AlertCircle className="h-5 w-5 text-primary-foreground" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                                                    <h3 className="text-sm font-semibold truncate">
                                                        {notification.notificationType && notification.notificationType.name}
                                                    </h3>
                                                    <Badge
                                                        variant={notification.isRead ? "secondary" : "default"}
                                                        className={`text-xs ${notification.isRead ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}
                                                    >
                                                        {notification.isRead ? "Read" : "Unread"}
                                                    </Badge>
                                                </div>
                                                <div
                                                    className="text-sm text-muted-foreground mb-2 break-words"
                                                    dangerouslySetInnerHTML={{ __html: notification.message }}
                                                />
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {timeAgo(notification.dateSent)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            {!hasMore && notificationHistories.length > 0 && (
                                <p className="text-center text-muted-foreground italic p-4">No more notifications.</p>
                            )}
                            {loading && <LoadingSpinner />}
                            {error && <p className="text-center text-destructive p-4" role="alert">{error}</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </LayoutComponent>
    );
}

