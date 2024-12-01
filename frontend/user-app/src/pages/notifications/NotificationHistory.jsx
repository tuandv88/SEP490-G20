

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { NotificationApi } from "@/services/api/notificationApi";

const LoadingSpinner = () => {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
        </div>
    );
};

const NotificationHistory = () => {
    const [notificationHistories, setNotificationHistories] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    const lastNotificationElementRef = useCallback(node => {
        if (loading || !hasMore) return;
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
                pageSize: pagination.pageSize
            });

            if (response && response.updatedNotificationHistories) {
                setNotificationHistories(prevHistories => [...prevHistories, ...response.updatedNotificationHistories]);
                setPagination(response.pagination);
                setHasMore(response.updatedNotificationHistories.length === pagination.pageSize);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi tải dữ liệu!');
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [pagination.pageIndex, pagination.pageSize, hasMore]);

    useEffect(() => {
        fetchNotificationHistories();
    }, [fetchNotificationHistories]);

    return (
        <div className="container-notification">
            <h1>Notifications</h1>

            <div className="notification-list">
                {notificationHistories.length === 0 && !loading ? (
                    <p>Không có thông báo nào.</p>
                ) : (
                    notificationHistories.map((notification, index) => (
                        <div
                            key={notification.id}
                            ref={index === notificationHistories.length - 1 ? lastNotificationElementRef : null}
                            className="notification-item"
                        >
                            <div
                                className="notification-content"
                                dangerouslySetInnerHTML={{
                                    __html: notification.message,
                                }}
                            />
                        </div>
                    ))
                )}
                <div className="no-more-notifications">
                    {!hasMore && notificationHistories.length > 0 && <p>Không còn thông báo nào khác.</p>}
                </div>
                {loading && <LoadingSpinner />}
                {error && <p className="error">{error}</p>}
            </div>

            <style jsx>{`
                .container-notification {
                    max-width: 900px;
                    margin: 0 auto;
                }

                h1 {
                    font-size: 1.5rem;
                    color: #1e334a;
                    text-align: center;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-top: 25px;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #1e334a;
                }

                .notification-list {
                    /* Add styles if needed */
                }

                .notification-item {
                    margin: 0;
                }

                .notification-content {
                    padding: 2px;
                }

                .error {
                    color: red;
                }

                .loading-spinner {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 50px;
                }

                .spinner {
                    width: 30px;
                    height: 30px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #1e334a;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .no-more-notifications {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px 0;
                }

                .no-more-notifications p {
                    font-style: italic;
                    color: #666;
                }
            `}</style>
        </div>
    );
};

export default NotificationHistory;

