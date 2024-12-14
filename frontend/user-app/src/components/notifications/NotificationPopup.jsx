import React, { useState, useEffect, useRef, useCallback } from 'react'
import { NotificationApi } from "@/services/api/notificationApi"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, Clock, AlertCircle, Settings, List } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'

function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center h-8">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
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

export default function PopupNotification() {
    const [isOpen, setIsOpen] = useState(false);
    const [notificationHistories, setNotificationHistories] = useState([]);
    const [totalNotifications, setTotalNotifications] = useState(0);
    const [unreadNotifications, setUnreadNotifications] = useState(0); // Added unreadNotifications state
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 5,
        totalCount: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const popupRef = useRef(null);
    const navigate = useNavigate();

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
                setTotalNotifications(newPagination.totalCount);
                const unreadCount = response.updatedNotificationHistories.filter(n => !n.isRead).length; // Count unread notifications
                setUnreadNotifications(prevCount => prevCount + unreadCount); // Update unreadNotifications state
            } else {
                setHasMore(false);
            }
        } catch (err) {
            //setError('An error occurred while loading data!');
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [pagination.pageIndex, pagination.pageSize, hasMore]);

    useEffect(() => {
        if (isOpen) {
            fetchNotificationHistories();
        }
    }, [isOpen, fetchNotificationHistories]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const handleNavigate = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={popupRef}>
            <Button
                variant="ghost"
                size="icon"
                className="relative hover:scale-105 transition-transform"
                onClick={togglePopup}
            >
                <Bell className="w-5 h-5" />
                {/* {unreadNotifications > 0 && ( // Changed to use unreadNotifications
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadNotifications > 99 ? '99+' : unreadNotifications}
                    </span>
                )} */}
            </Button>

            {isOpen && (
                <Card className="absolute right-0 mt-2 w-[480px] shadow-lg rounded-lg overflow-hidden z-50">
                    <CardContent className="p-0">
                        <div className="bg-primary p-3 text-primary-foreground flex justify-between items-center">
                            <h3 className="text-lg font-semibold flex items-center">
                                <Bell className="mr-2 h-5 w-5" />
                                Notifications
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                                {totalNotifications} Total
                            </Badge>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
                            {notificationHistories.length === 0 && !loading ? (
                                <p className="text-center text-muted-foreground p-4 text-sm">No notifications available.</p>
                            ) : (
                                notificationHistories.map((notification, index) => (
                                    <div
                                        key={notification.id}
                                        ref={index === notificationHistories.length - 1 ? lastNotificationElementRef : null}
                                        className={`border-b last:border-b-0 p-3 transition-all duration-300 ease-in-out hover:bg-accent ${notification.isRead ? "bg-background" : "bg-primary/5"}`}
                                    >
                                        <div className="flex items-start space-x-2">
                                            <div className={`rounded-full p-1.5 flex-shrink-0 ${notification.isRead ? "bg-secondary" : "bg-primary"}`}>
                                                {notification.isRead ? (
                                                    <CheckCircle className="h-4 w-4 text-secondary-foreground" />
                                                ) : (
                                                    <AlertCircle className="h-4 w-4 text-primary-foreground" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-semibold truncate mb-0.5">
                                                    {notification.notificationType && notification.notificationType.name}
                                                </h4>
                                                <div
                                                    className="text-xs text-muted-foreground mb-1 break-words line-clamp-2"
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
                                <p className="text-center text-muted-foreground italic p-2 text-xs">No more notifications.</p>
                            )}
                            {loading && <LoadingSpinner />}
                            {error && <p className="text-center text-destructive p-2 text-xs" role="alert">{error}</p>}
                        </div>
                        <div className="border-t p-2 flex justify-between items-center">
                            {/* <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                                onClick={() => handleNavigate('#')}
                            >
                                <Settings className="h-4 w-4 mr-1" />
                                Settings
                            </Button> */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                                onClick={() => handleNavigate('/notifications/history')}
                            >
                                <List className="h-4 w-4 mr-1" />
                                All Notifications
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

