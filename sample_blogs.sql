-- Dữ liệu mẫu cho bảng blogs
-- Lưu ý: Đảm bảo bảng 'users' đã có ít nhất 1 bản ghi với id = 1 để làm author_id

INSERT INTO blogs (title, slug, content, thumbnail, summary, published, created_at, updated_at, author_id) VALUES 
(
    'Top 10 cuốn sách nên đọc trong năm 2024', 
    'top-10-cuon-sach-nen-doc-2024', 
    '<p>Năm 2024 hứa hẹn mang đến nhiều tác phẩm văn học đặc sắc từ các tác giả nổi tiếng trên thế giới...</p><ul><li>Sách trinh thám</li><li>Sách kinh tế</li><li>Sách kỹ năng sống</li></ul>', 
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800', 
    'Khám phá danh sách những cuốn sách được mong chờ nhất và có giá trị nhất trong năm nay.', 
    1, 
    NOW(), 
    NOW(), 
    1
),
(
    'Làm thế nào để xây dựng thói quen đọc sách mỗi ngày?', 
    'cach-xay-dung-thoi-quen-doc-sach', 
    '<p>Đọc sách là một trong những thói quen tốt nhất giúp bạn mở mang kiến thức và giảm căng thẳng...</p><p>Hãy bắt đầu với 15 phút mỗi ngày trước khi đi ngủ hoặc ngay sau khi thức dậy.</p>', 
    'https://images.unsplash.com/photo-1512820790803-73c772ff376f?q=80&w=800', 
    'Bí quyết giúp bạn duy trì việc đọc sách đều đặn mà không cảm thấy nhàm chán.', 
    1, 
    NOW(), 
    NOW(), 
    1
),
(
    'Review sách: Nhà Giả Kim - Hành trình đi tìm ước mơ', 
    'review-sach-nha-gia-kim', 
    '<p>Nhà Giả Kim của Paulo Coelho không chỉ là một cuốn tiểu thuyết, nó là một bài học về cuộc sống...</p><p>Câu chuyện về Santiago dạy chúng ta rằng khi bạn thực sự khao khát điều gì, cả vũ trụ sẽ hợp lực giúp bạn.</p>', 
    'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800', 
    'Cùng điểm qua những thông điệp sâu sắc từ cuốn sách bán chạy nhất mọi thời đại này.', 
    1, 
    NOW(), 
    NOW(), 
    1
),
(
    'Sự khác biệt giữa sách giấy và sách điện tử (E-book)', 
    'sach-giay-vs-sach-dien-tu', 
    '<p>Cuộc tranh luận giữa việc đọc sách giấy truyền thống hay dùng máy đọc sách Kindle vẫn chưa có hồi kết...</p><p>Mỗi loại đều có những ưu điểm riêng về cảm giác cầm nắm và sự tiện lợi.</p>', 
    'https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=800', 
    'Phân tích ưu và nhược điểm của sách giấy và e-book để bạn có lựa chọn phù hợp nhất.', 
    1, 
    NOW(), 
    NOW(), 
    1
),
(
    'Gợi ý những góc đọc sách cực chill tại nhà', 
    'goc-doc-sach-chill-tai-nha', 
    '<p>Một không gian yên tĩnh và thoải mái sẽ giúp bạn tập trung hơn vào nội dung cuốn sách...</p><p>Tận dụng ánh sáng tự nhiên và thêm một chút cây xanh để căn phòng thêm sinh động.</p>', 
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800', 
    'Những ý tưởng thiết kế góc đọc sách đơn giản nhưng mang lại cảm hứng bất tận.', 
    1, 
    NOW(), 
    NOW(), 
    1
);
