using Community.Application.Models.UserDiscussions.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Extensions
{
    public static class UserDiscussionExtensions
    {
        public static UserDiscussionDto ToUserDiscussionDto(this UserDiscussion userDiscussion)
        {
            return new UserDiscussionDto(
                Id: userDiscussion.Id.Value,
                UserId: userDiscussion.UserId.Value,
                DiscussionId: userDiscussion.DiscussionId.Value,
                IsFollowing: userDiscussion.IsFollowing,
                DateFollowed: userDiscussion.DateFollowed,
                LastViewed: userDiscussion.LastViewed,
                NotificationsEnabled: userDiscussion.NotificationsEnabled
            );
        }
    }
}
