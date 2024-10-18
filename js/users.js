const ENDPOINT = 'https://crudnodejs-production.up.railway.app/api';

$(document).ready(function () {
    table = $('#userTable').DataTable({
        "info": false,
        "paging": true,
        "pageLength": 8,
        "lengthChange": false,
        "searching": false,
        "ordering": false,
        "pagingType": "simple_numbers",
        "language": {
            "paginate": {
                "first": "Đầu",
                "last": "Cuối",
                "next": '<img src="./image/icons/next.svg" alt="Next" />',
                "previous": '<img src="./image/icons/prev.svg" alt="Previous" />'
            },
        }
    });
    searchTable();
    fetchUserData();
    attachSidebarEvents();
    attachAddEvents();
});

let table;
async function fetchUserData(query = null) {
    try {
        let searchQuery = '';
        if (query) {
            searchQuery = 'search?q=' + query
        }
        const response = await fetch(`${ENDPOINT}/users/${searchQuery}`);
        const users = await response.json();
        populateTable(query ? users.users : users);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function deleteUser(userId, row) {
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
}

let timeOut
function searchTable() {
    $('#search').on('input', function () {
        const query = $(this).val().toLowerCase();

        clearTimeout(timeOut)

        timeOut = setTimeout(() => {
            fetchUserData(query)
        }, 500)

    });

}


function populateTable(users) {
    table.clear();
    console.log(users);
    table
    users.forEach((user, index) => {
        const row = $(`
            <tr data-user-id="${user._id}">
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
            </tr>
        `);
        table.row.add(row);
    });
    table.draw();
    attachDeleteEvents();
}

function attachDeleteEvents() {
    $('.btn-delete').on('click', function () {
        const row = $(this).closest('tr');
        const userId = row.data('user-id');
        console.log('Xóa người dùng với ID:', userId);
        deleteUser(userId, row);
    });
}

function attachAddEvents() {
    $('.btn-new-user').on('click', function () {
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

        $('.main-content').html(addUserlHTML);
        $('.cancel-btn').on('click', function () {
            window.location.href = 'users.html';
        })

        $('input').on('input', function () {
            const username = $('#username').val().trim();
            const password = $('#password').val().trim();
            const email = $('#email').val().trim();
            const isFormValid = username && password && email;
            $('.create-btn').prop('disabled', !isFormValid);
        });
        $('#addUserForm').on('submit', async function (event) {
            event.preventDefault();
            const username = $('#username').val();
            const password = $('#password').val();
            const email = $('#email').val();

            try {
                const response = await fetch(`${ENDPOINT}/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        password,
                        email
                    })
                });

                if (response.ok) {
                    fetchUserData();
                    window.location.href = 'users.html';
                } else {
                    const errorData = await response.json();
                    alert('' + errorData.message);
                }
            } catch (error) {
                console.error('', error);
            }
        });
    });
}

function attachSidebarEvents() {
    $('.btn__toggle').click(function () {
        $('.sidebar').toggleClass('collapsed');
        if ($('.sidebar').hasClass('collapsed')) {
            $('.logo-a').fadeOut(400, function () {
                $('.logo-b').fadeIn(400);
            });
        } else {
            $('.logo-b').fadeOut(400, function () {
                $('.logo-a').fadeIn(400);
            });
        }
    });
}
