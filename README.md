## React Chat - Ứng dụng nhắn tin trực tuyến - BackEnd
<img src="https://minhtrichat.tk/chat512.png" height="100" alt="React Chat logo">

Đây là phần backend của ứng dụng [React chat](https://minhtri-chat.ga). Phần backend được viết bằng nodejs, express, socket.io, jwt mongodb.

### Đường dẫn
* Trang chủ website tại đây [Link trang chủ](https://minhtri-chat.ga)
* Github FrondEnd [Link github FrondEnd](https://github.com/minhtrithcb/chat)

### Chức năng
* Request http: 
    * Bảo mật: Đăng nhập, đăng ký, đăng xuất, đổi mật khẩu, xác thực tài khoản, lấy acessToken, refreshToken.
    * Nhắn tin: Gửi tin nhắn, sửa tin, trả lời, thả biểu cảm, thu hồi.
    * Hội thoại: Danh sách hội thoại, đếm tin chưa đọc, xóa nhóm, rời nhóm, sửa, cấm chat, ...
    * Lời mời kết bạn: Gửi tin , nhận tin, chấp nhận, đồng ý, thu hồi. 
    * Lời mời Vào nhóm: Gửi tin, nhận tin, chấp nhận, đồng ý, thu hồi, chấp nhận nếu là nhóm mở.
    * Người dùng: Lấy theo id, lấy danh sách bạn bè, xóa kết bạn, tìm kiếm.

* Realtime : 
    * Người dùng gia nhập hội thoại, nhắn tin, kết bạn, rời nhóm, online, ...
