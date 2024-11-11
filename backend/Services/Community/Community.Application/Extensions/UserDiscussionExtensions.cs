using Community.Application.Models.Discussions.Dtos;
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
        public static async Task<List<UserDiscussionDto>> ToUserDiscussionDtoListAsync(this List<UserDiscussion> userDiscussions)
        {
            var tasks = userDiscussions.Select(async ud =>
            {
                return ud.ToUserDiscussionDto();
            });

            var userDiscussionDtos = await Task.WhenAll(tasks);
            return userDiscussionDtos.ToList();
        }

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
