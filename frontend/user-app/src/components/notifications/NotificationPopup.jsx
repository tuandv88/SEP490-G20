'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { NotificationApi } from "@/services/api/notificationApi"

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
)

const NotificationPopup = ({ isOpen, onOpenChange }) => {
    const [notificationHistories, setNotificationHistories] = useState([])
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 5,
        totalCount: 0,
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [hasMore, setHasMore] = useState(true)

    const fetchNotificationHistories = useCallback(async () => {
        if (!hasMore) return
        setLoading(true)
        setError(null)

        try {
            const response = await NotificationApi.getNotificationHistoriesByIdUserCurrent({
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize
            })

            if (response && response.updatedNotificationHistories) {
                setNotificationHistories(prevHistories => [...prevHistories, ...response.updatedNotificationHistories])
                setPagination(response.pagination)
                setHasMore(response.updatedNotificationHistories.length === pagination.pageSize)
            } else {
                setHasMore(false)
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi tải dữ liệu!')
            setHasMore(false)
        } finally {
            setLoading(false)
        }
    }, [pagination.pageIndex, pagination.pageSize, hasMore])

    useEffect(() => {
        if (isOpen) {
            fetchNotificationHistories()
        }
    }, [isOpen, fetchNotificationHistories])

    const loadMore = () => {
        setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Thông báo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {notificationHistories.map((notification) => (
                        <div key={notification.id} className="border-b pb-2">
                            <div
                                className="notification-content"
                                dangerouslySetInnerHTML={{
                                    __html: notification.message,
                                }}
                            />
                        </div>
                    ))}

                    {loading && <LoadingSpinner />}
                    {error && <p className="text-red-500">{error}</p>}
                    {!hasMore && notificationHistories.length > 0 && (
                        <p className="text-center text-gray-500 italic">Không còn thông báo nào khác.</p>
                    )}
                </div>

                {hasMore && (
                    <Button onClick={loadMore} className="w-full mt-4">
                        Tải thêm
                    </Button>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default NotificationPopup
