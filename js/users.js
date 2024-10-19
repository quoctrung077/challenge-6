const ENDPOINT = "https://crudnodejs-production.up.railway.app/api";

$(document).ready(function () {
    table = $("#userTable").DataTable({
        info: false,
        paging: true,
        pageLength: 8,
        lengthChange: false,
        searching: false,
        ordering: false,
        pagingType: "simple_numbers",
        language: {
            paginate: {
                first: "Đầu",
                last: "Cuối",
                next: '<img src="./image/icons/next.svg" alt="Next" />',
                previous: '<img src="./image/icons/prev.svg" alt="Previous" />',
            },
        },
    });
    searchTable();
    fetchUserData();
    attachSidebarEvents();
    attachAddEvents();
    attachDetailEvents();
    attachUpdateUserEvents();
    attachDeleteUserEvents();

});

let table;
async function fetchUserData(query = null) {
    try {
        let searchQuery = "";
        if (query) {
            searchQuery = "search?q=" + query;
        }
        const response = await fetch(`${ENDPOINT}/users/${searchQuery}`);
        const users = await response.json();
        populateTable(query ? users.users : users);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function attachDeleteUserEvents() {
    $('#userTable').on('click', '.btn-delete', async function () {
        const row = $(this).closest('tr');
        const userId = row.data('user-id');
        try {
            const response = await fetch(`${ENDPOINT}/users/${userId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                table.row(row).remove().draw();
                fetchUserData();
            }
        } catch (error) {
            console.error('Lỗi khi xóa người dùng:', error);
        }
    });
}

let timeOut;
function searchTable() {
    $("#search").on("input", function () {
        const query = $(this).val().toLowerCase();

        clearTimeout(timeOut);

        timeOut = setTimeout(() => {
            fetchUserData(query);
        }, 500);
    });
}

function populateTable(users) {
    table.clear();
    users.forEach((user, index) => {
        const row = $(`<tr data-user-id="${user._id}">
            <td>${index + 1}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>
                <button class="btn-detail">
                    <img src="./image/icons/btn-detail.svg" alt="Detail" />
                </button>
                <button class="btn-edit">
                    <img src="./image/icons/btn-edit.svg" alt="Edit" />
                </button>
                <button class="btn-delete">
                    <img src="./image/icons/btn-delete.svg" alt="Delete" />
                </button>
            </td>
        </tr>`);
        table.row.add(row);
    });
    table.draw();
}

function attachAddEvents() {
    $(".btn-new-user").on("click", function () {
        const addUserlHTML = `
        <div class="from-page"">
          <div class="page-title">
            <div class="page-arrow">
              <img src="./image/icons/arrow-left.svg" alt="" />
            </div>
            <h2>New User</h2>
          </div>
          <div class="form">
            <form id="addUserForm">
              <div class="input-wrap">
                <label for="username"
                  >User Name<span style="color: red">*</span></label
                >
                <input type="text" id="username" name="username" required />
              </div>
              <div class="input-wrap">
                <label for="password"
                  >Password<span style="color: red">*</span></label
                >
                <input type="password" id="password" name="password" required />
              </div>
              <div class="input-wrap">
                <label for="email"
                  >Email<span style="color: red">*</span></label
                >
                <input type="email" id="email" name="email" required />
              </div>
              <div class="button__group">
                <button type="submit" class="btn-form create-btn" disabled>
                  Create
                </button>
                <button type="button" class="btn-form cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      `;

        $(".main-content").html(addUserlHTML);
        $(".cancel-btn").on("click", function () {
            window.location.href = "users.html";
        });

        $("input").on("input", function () {
            const username = $("#username").val().trim();
            const password = $("#password").val().trim();
            const email = $("#email").val().trim();
            const isFormValid = username && password && email;
            $(".create-btn").prop("disabled", !isFormValid);
        });
        $("#addUserForm").on("submit", async function (event) {
            event.preventDefault();
            const username = $("#username").val();
            const password = $("#password").val();
            const email = $("#email").val();

            try {
                const response = await fetch(`${ENDPOINT}/users`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        password,
                        email,
                    }),
                });

                if (response.ok) {
                    fetchUserData();
                    window.location.href = "users.html";
                } else {
                    const errorData = await response.json();
                    alert("" + errorData.message);
                }
            } catch (error) {
                console.error("", error);
            }
        });
    });
}

function attachDetailEvents() {
    $('#userTable').on('click', '.btn-detail', async function () {
        const row = $(this).closest('tr');
        const userId = row.data('user-id');
        try {
            const response = await fetch(`${ENDPOINT}/users/${userId}`);
            if (!response.ok) {
                throw new Error('Error fetching user detail');
            }
            const userDetail = await response.json();

            const DetailUserlHTML = `
                <div class="from-page">
                    <div class="page-title">
                        <div class="page-arrow">
                            <img src="./image/icons/arrow-left.svg" alt="" />
                        </div>
                        <h2>Detail User</h2>
                    </div>
                    <div class="form">
                        <form action="">
                            <div class="input-wrap">
                                <label for="username">User Name<span style="color: red">*</span></label>
                                <input type="text" id="username" name="username" value="${userDetail.username}" required readonly />
                            </div>
                            <div class="input-wrap">
                                <label for="email">Email<span style="color: red">*</span></label>
                                <input type="email" id="email" name="email" value="${userDetail.email}" required readonly />
                            </div>
                            <div class="button__group">
                                <button type="button" class="btn-form cancel-btn">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            $('.main-content').html(DetailUserlHTML);

            $('.cancel-btn').on('click', function () {
                window.location.href = 'users.html';
            });
        } catch (error) {
            console.error('Error fetching user detail:', error);
            alert('Không thể lấy thông tin người dùng.');
        }
    });
}

function attachUpdateUserEvents() {
    $('#userTable').on('click', '.btn-edit', async function () {
        const row = $(this).closest('tr');
        const userId = row.data('user-id');

        try {
            const response = await fetch(`${ENDPOINT}/users/${userId}`);
            if (!response.ok) {
                throw new Error('Error fetching user details for update');
            }
            const userUpdate = await response.json();

            const updateUserHTML = `
        <div class="from-page">
          <div class="page-title">
            <div class="page-arrow">
              <img src="./image/icons/arrow-left.svg" alt="" />
            </div>
            <h2>Update User</h2>
          </div>
          <div class="form">
            <form id="updateUserForm">
              <div class="input-wrap">
                <label for="username"
                  >User Name<span style="color: red">*</span></label
                >
                <input type="text" id="username" name="username" value="${userUpdate.username}" required />
              </div>
              <div class="input-wrap">
                <label for="email"
                  >Email<span style="color: red">*</span></label
                >
                <input type="email" id="email" name="email" value="${userUpdate.email}" required />
              </div>
              <div class="button__group">
                <button type="button" class="btn-form changePassword-btn">
                  Change Password
                </button>
                <button type="submit" class="btn-form save-btn">Save</button>
                <button type="button" class="btn-form cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
            <div class="box-change-password" style="display: none">
              <div class="icon-x">
                <img src="./image/icons/icon-x.svg" alt="" />
              </div>
                <div class="input-wrap">
                <label for="email"
                  >Email<span style="color: red">*</span></label
                >
                <input type="email" id="email" name="email" value="${userUpdate.email}" required readonly/>
              </div>
              <div class="input-wrap">
                <label for="password"
                  >New Password<span style="color: red">*</span></label
                >
                <input type="password" id="new-password" name="new password" required readonly />
              </div>
              <div class="button__group">
                <button type="button" class="btn-form apply-btn">Apply</button>
              </div>
            </div>
          </div>
        </div>
            `;
            $('.main-content').html(updateUserHTML);

            $('.cancel-btn').on('click', function () {
                window.location.href = 'users.html';
            });

            $('.changePassword-btn').on('click', function () {
                $('.box-change-password').show();
            })

            $('.box-change-password').on('click', '.icon-x', function () {
                $('.box-change-password').hide();
            });

            $('#updateUserForm').on('submit', async function (event) {
                event.preventDefault();
                const username = $('#username').val();
                const password = $('#password').val();
                const email = $('#email').val();

                try {
                    const updateResponse = await fetch(`${ENDPOINT}/users/${userId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username,
                            password,
                            email
                        })
                    });

                    if (updateResponse.ok) {
                        fetchUserData();
                        window.location.href = 'users.html';
                    } else {
                        const errorData = await updateResponse.json();
                        alert('' + errorData.message);
                    }
                } catch (error) {
                    console.error('Error updating user:', error);
                    alert('Lỗi khi cập nhật người dùng.');
                }
            });

            $('.box-change-password').on('click', '.apply-btn', async function () {
                const newPassword = $('#new-password').val();
                const email = $('#email').val();

                try {
                    const passwordResponse = await fetch(`${ENDPOINT}/users/forgot-password`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email,
                            password: newPassword
                        })
                    });

                    if (passwordResponse.ok) {
                        alert('Mật khẩu đã được cập nhật thành công.', newPassword);
                        $('#new-password').attr('type', 'text').val(newPassword);
                    } else {
                        const errorData = await passwordResponse.json();
                        alert('' + errorData.message);
                    }
                } catch (error) {
                    console.error('Error updating password:', error);
                    alert('Lỗi khi cập nhật mật khẩu.');
                }
            });

        } catch (error) {
            console.error('Error fetching user details for update:', error);
            alert('Không thể lấy thông tin người dùng.');
        }
    });
}

function attachSidebarEvents() {
    $(".btn__toggle").click(function () {
        $(".sidebar").toggleClass("collapsed");
        if ($(".sidebar").hasClass("collapsed")) {
            $(".logo-a").fadeOut(400, function () {
                $(".logo-b").fadeIn(400);
            });
        } else {
            $(".logo-b").fadeOut(400, function () {
                $(".logo-a").fadeIn(400);
            });
        }
    });
}
