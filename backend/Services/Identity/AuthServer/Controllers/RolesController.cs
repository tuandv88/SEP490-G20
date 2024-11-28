using AuthServer.Dtos.Roles;
using AuthServer.Dtos.Users;
using AuthServer.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthServer.Controllers
{

    [Route("[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {

        private readonly UserManager<Users> _userManager;
        private readonly RoleManager<Roles> _roleManager;
        public RolesController(UserManager<Users> userManager, RoleManager<Roles> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // API để lấy tất cả các role
        [HttpGet("all")]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _roleManager.Roles.ToListAsync();

            if (roles == null || roles.Count == 0)
            {
                return NotFound(new { message = "No roles found." });
            }

            var roleDtos = roles.Select(role => new RoleDto
            {
                Id = role.Id,
                Name = role.Name
            }).ToList();

            return Ok(roleDtos);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleDto request)
        {
            // Kiểm tra xem role đã tồn tại chưa
            var existingRole = await _roleManager.FindByNameAsync(request.Name);
            if (existingRole != null)
            {
                return BadRequest($"Role '{request.Name}' already exists.");
            }

            var newRole = new Roles { Name = request.Name };

            var result = await _roleManager.CreateAsync(newRole);
            if (!result.Succeeded)
            {
                return BadRequest($"Failed to create role '{request.Name}'.");
            }

            return Ok(new { Message = $"Role '{request.Name}' has been created successfully." });
        }


        [HttpPut("updateroleuser")]
        public async Task<IActionResult> UpdateUserRole([FromBody] UpdateRoleRequestDto request)
        {
            // Lấy user từ UserManager
            var user = await _userManager.FindByIdAsync(request.UserId); // Hoặc sử dụng FindByEmailAsync nếu bạn muốn tìm theo email
            if (user == null)
            {
                return NotFound($"User with ID {request.UserId} not found.");
            }

            // Kiểm tra xem RoleId có hợp lệ hay không
            var role = await _roleManager.FindByIdAsync(request.RoleId);
            if (role == null)
            {
                return BadRequest($"Role with ID {request.RoleId} does not exist.");
            }

            // Lấy danh sách các role của user
            var userRoles = await _userManager.GetRolesAsync(user);

            // Nếu user đã có role đó, trả về OK
            if (userRoles.Contains(role.Name))
            {
                return Ok(new { Message = $"User already has the role '{role.Name}' for UserId: {request.UserId}" });
            }

            // Xóa tất cả các role hiện tại của user (nếu cần thiết)
            var removeRolesResult = await _userManager.RemoveFromRolesAsync(user, userRoles);
            if (!removeRolesResult.Succeeded)
            {
                return BadRequest("Failed to remove current roles.");
            }

            // Thêm role mới cho user
            var addRoleResult = await _userManager.AddToRoleAsync(user, role.Name);
            if (!addRoleResult.Succeeded)
            {
                return BadRequest("Failed to add new role.");
            }

            return Ok(new {Message = $"User's role has been updated to '{role.Name}'." });
        }

        [HttpDelete("remove/{roleId}")]
        public async Task<IActionResult> RemoveRole(string roleId)
        {
            // Lấy role từ RoleManager
            var role = await _roleManager.FindByIdAsync(roleId);
            if (role == null)
            {
                return NotFound($"Role with ID {roleId} not found.");
            }

            var result = await _roleManager.DeleteAsync(role);
            if (!result.Succeeded)
            {
                return BadRequest($"Failed to delete role with ID {roleId}.");
            }

            return Ok(new { Message = $"Role with ID {roleId} has been deleted successfully." });
        }
    }
}
