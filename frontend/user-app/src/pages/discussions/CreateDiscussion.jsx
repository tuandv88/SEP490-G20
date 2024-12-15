import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill"; // Trình soạn thảo văn bản
import "react-quill/dist/quill.snow.css"; // Import style của react-quill
import styled from "styled-components";
import Layout from "@/layouts/layout";
import { DiscussApi } from "@/services/api/DiscussApi";
import { useNavigate } from "react-router-dom"; // Import hook useNavigate

const CreateDiscussion = () => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(""); // Lưu giá trị của category
  const [image, setImage] = useState(null); // Lưu ảnh tải lên
  const [categories, setCategories] = useState([]); // Lưu danh sách categories
  const navigate = useNavigate();  // Khai báo navigate
  // Gọi API để lấy danh sách categories khi component được load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await DiscussApi.getCategories();
        setCategories(data.categoryDtos); // Lưu dữ liệu categories vào state từ categoryDtos
      } catch (error) {

      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Xử lý ảnh để chuyển thành base64
    let base64Image = null;
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        base64Image = reader.result.split(",")[1]; // Lấy phần base64 từ kết quả đọc file

        // Thêm dữ liệu thảo luận và gửi đến API
        const discussionData = {
          title,
          tags: tags.split(",").map(tag => tag.trim()), // Chuyển tags thành mảng
          description: content,
          categoryId: category,
          image: {
            fileName: image.name,
            base64Image, // Dữ liệu base64 của ảnh
            contentType: image.type // Kiểu file của ảnh (ví dụ: image/png)
          },
          isActive: true // Trạng thái là "active"
        };

        // Gửi API
        DiscussApi.createDiscuss(discussionData)
          .then(response => {

          })
          .catch(error => {

          });
      };
      reader.readAsDataURL(image); // Đọc ảnh dưới dạng base64
    }
  };

  return (
    <Layout>
      <Container>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter Topic Title"
            />
          </FormGroup>

          {/* Tags and Category on the same row */}
          <FormGroupRow>
            <div>
              <input
                type="text"
                id="tags"
                name="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                required
                placeholder="Tag your topic (separated by commas)"
              />
            </div>
            <div>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Chọn Category</option>
                {categories.filter(cat => cat.isActive).map((cat) => ( // Lọc các category có isActive = true
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </FormGroupRow>

          {/* Image upload */}
          <FormGroup>
            <label htmlFor="image">Chọn hình ảnh</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
          </FormGroup>

          {/* Phần nhập nội dung thảo luận (Lớn hơn) */}
          <FormGroup>
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={{ toolbar: true }}
              theme="snow"
              placeholder="Write your discussion here..."
              style={{ height: "300px", marginBottom: "30px" }} // Thêm margin dưới
            />
          </FormGroup>

          {/* Nút Post và Close */}
          <FormGroup>
            <ButtonContainer>
              <PostButton type="submit" onClick={() => navigate("/discussions/discuss")}>
                Post
              </PostButton>

              <CloseButton type="button" onClick={() => console.log("Close")}>Close</CloseButton>
            </ButtonContainer>
          </FormGroup>
        </form>
      </Container>
    </Layout>
  );
};

export default CreateDiscussion;

// Styled Components

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  padding: 20px;
  margin-top: 70px; // Thêm margin-top để tạo khoảng cách với phần trên
`;

const FormGroup = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
  }

  input,
  select {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 14px;
    margin-top: 5px;
  }

  .ql-editor {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
`;

const FormGroupRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px; // Khoảng cách giữa hàng nhập liệu và dưới

  div {
    flex: 1;
  }

  input,
  select {
    width: 100%;
    padding: 12px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 14px;
    margin-top: 5px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px; // Để các nút cách nhau một khoảng
  margin-top: 20px; // Đảm bảo nút không bị chồng lên phần nội dung thảo luận
`;

const PostButton = styled.button`
  margin: 16px 1px; 
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const CloseButton = styled.button`
  margin: 16px 1px;  
  padding: 5px 10px;
  background-color: #ccc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #aaa;
  }
`;
