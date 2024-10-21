const ENDPOINT = "https://crudnodejs-production.up.railway.app/api";
const token = localStorage.getItem('authToken');

$(document).ready(function () {
  table = $("#projectTable").DataTable({
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

  logout();
  attachAddEvents();
  fetchProjectData();
  attachDeleteProjectEvents();
  attachDetailProjectEvents();
  attachUpdateProjectEvents();
});

// -- log out --
function logout() {
  $('.logout').on('click', function () {
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
  });
}
// -- add project --
function attachAddEvents() {
  $(".btn-new-project").on("click", function () {
    const addProjectHTML = `
      <div class="from-page">
        <div class="page-title">
          <div class="page-arrow">
            <img src="./image/icons/arrow-left.svg" alt="" />
          </div>
          <h2>New Project</h2>
        </div>
        <div class="form">
          <form id="addProjectForm">
            <div class="input-wrap">
              <label for="username">Name<span style="color: red">*</span></label>
              <input type="text" id="username" name="username" required />
            </div>
            <div class="input-wrap">
              <label for="description">Description<span style="color: red">*</span></label>
              <input type="text" id="description" name="description" required />
            </div>
            <div class="date-wrapper">
              <div class="input-wrap">
                <label for="start-date">Start date<span style="color: red">*</span></label>
                <input type="date" id="start-date" name="start-date" required />
              </div>
              <div class="input-wrap">
                <label for="end-date">End date<span style="color: red">*</span></label>
                <input type="date" id="end-date" name="end-date" required />
              </div>
            </div>
            <div class="button__group">
              <button type="submit" class="btn-form create-btn" disabled>Create</button>
              <button type="button" class="btn-form cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;

    $(".main-content").html(addProjectHTML);

    $(".cancel-btn").on("click", function () {
      window.location.href = "project.html";
    });

    $("input").on("input", function () {
      const name = $("#username").val();
      const description = $("#description").val();
      const startDate = $("#start-date").val();
      const endDate = $("#end-date").val();
      const isFormValid = name && description && startDate && endDate;
      $(".create-btn").prop("disabled", !isFormValid);
    });

    $("#addProjectForm").on("submit", async function (event) {
      event.preventDefault();
      const name = $("#username").val();
      const description = $("#description").val();
      const startDate = $("#start-date").val();
      const endDate = $("#end-date").val();
      try {
        const response = await fetch(`${ENDPOINT}/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name,
            description,
            startDate,
            endDate,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create project');
        }

        const data = await response.json();
        alert('Project created successfully!');
        window.location.href = "project.html";
      } catch (error) {
        console.error('Error:', error);
        alert('Error creating project: ' + error.message);
      }
    });
  });
}

//-- create table Project --
let table;
function populateTable(projects) {
  table.clear();
  projects.forEach((projects, index) => {
    const startDate = projects.startDate.split('T')[0];
    const endDate = projects.endDate.split('T')[0];
    const row = $(`<tr data-project-id="${projects._id}">
          <td>${index + 1}</td>
          <td>${projects.name}</td>
          <td><img src="./image/icons/icon-new.svg" alt="" style="margin-right: 8px;
              "/>${projects.status}</td>  
          <td>${startDate}</td> 
          <td>${endDate}</td>  
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

//-- List Project -- 
async function fetchProjectData() {
  try {
    const response = await fetch(`${ENDPOINT}/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const projects = await response.json();
    populateTable(projects);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//-- delete Project --
function attachDeleteProjectEvents() {
  $('#projectTable').on('click', '.btn-delete', async function () {
    const row = $(this).closest('tr');
    const projectId = row.data('project-id');
    try {
      const response = await fetch(`${ENDPOINT}/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          //Spread operator
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      if (response.ok) {
        table.row(row).remove().draw();
        fetchProjectData();
      }
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
    }
  });
}

//-- detail Project -- 
function attachDetailProjectEvents() {
  $('#projectTable').on('click', '.btn-detail', async function () {
    const row = $(this).closest('tr');
    const projectId = row.data('project-id');

    try {
      const projectResponse = await fetch(`${ENDPOINT}/projects/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!projectResponse.ok) {
        throw new Error('Error fetching project details');
      }

      const project = await projectResponse.json();

      const detailProjectHTML = `
        <div class="from-page">
          <div class="page-title">
            <div class="page-arrow">
              <img src="./image/icons/arrow-left.svg" alt="" />
            </div>
            <h2>Update Project</h2>
          </div>
          <div class="form">
            <form id="detailProjectForm">
              <div class="input-wrap">
                <label for="username">Name</label>
                <input type="text" id="username" name="username" value="${project.name}" required readonly />
              </div>
              <div class="input-wrap">
                <label for="description">Description</label>
                <input type="text" id="description" name="description" value="${project.description}" required readonly />
              </div>
              <div class="date-wrapper">
                <div class="input-wrap">
                  <label for="start-date">Start date</label>
                  <input type="date" id="start-date" name="start-date" value="${project.startDate.split('T')[0]}" required readonly />
                </div>
                <div class="input-wrap">
                  <label for="end-date">End date</label>
                  <input type="date" id="end-date" name="end-date" value="${project.endDate.split('T')[0]}" required readonly />
                </div>
              </div>
              <div class="table-member-container">
              <div style="margin-bottom: 8px; ">Members</div>
                <table id="memberTable" class="display" style="width: 100%">
                  <thead>
                    <tr style="height: 40px">
                      <th>#</th>
                      <th>User Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
              <div class="button__group">
                <button type="button" class="btn-form cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      `;

      $(".main-content").html(detailProjectHTML);

      $(".cancel-btn").on("click", function () {
        window.location.href = "project.html";
      });

      tableMember = $("#memberTable").DataTable({
        info: false,
        paging: true,
        pageLength: 4,
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

      populateTableMembers(project.members);

    } catch (error) {
      console.error('Error fetching project details:', error);
      alert('Không thể lấy thông tin dự án.');
    }
  });
}

//-- update Project -- 
function attachUpdateProjectEvents() {
  $('#projectTable').on('click', '.btn-edit', async function () {
    const row = $(this).closest('tr');
    const projectId = row.data('project-id');
    try {
      const projectResponse = await fetch(`${ENDPOINT}/projects/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!projectResponse.ok) {
        throw new Error('Error fetching project details');
      }

      const project = await projectResponse.json();

      const updateProjectHTML = `
        <div class="from-page">
          <div class="page-title">
            <div class="page-arrow">
              <img src="./image/icons/arrow-left.svg" alt="" />
            </div>
            <h2>Update Project</h2>
          </div>
          <div class="form">
            <form id="ProjectForm">
              <div class="input-wrap">
                <label for="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value="${project.name}"
                  required
                />
              </div>
              <div class="input-wrap">
                <label for="description">Description</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value="${project.description}"
                  required
                />
              </div>
              <div class="date-wrapper">
                <div class="input-wrap">
                  <label for="start-date">Start date</label>
                  <input
                    type="date"
                    id="start-date"
                    name="start-date"
                    value="${project.startDate.slice(0, 10)}"
                    required
                  />
                </div>
                <div class="input-wrap">
                  <label for="end-date">End date</label>
                  <input
                    type="date"
                    id="end-date"
                    name="end-date"
                    value="${project.endDate.slice(0, 10)}"
                    required
                  />
                </div>
              </div>
              <div class="table-member-container">
                <div style="margin-bottom: 8px">Members</div>
                <table id="memberTable" class="display" style="width: 100%">
                  <thead>
                    <tr style="height: 40px">
                      <th>#</th>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>
                        <div class="btn-add-member" style="cursor: pointer;">
                          <img src="image/icons/add-member.svg" alt="" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
              <div class="box-add-user-project" style="display:none" >
                <div class="icon-x">
                  <img src="./image/icons/icon-x.svg" alt="" />
                </div>
                <div class="input-container">
                  <input
                    type="text"
                    id="search"
                    placeholder="Search..."
                    class="search"
                    src="image/icons/icon-search.svg"
                  />
                  <div class="icon-search">
                    <img src="image/icons/icon-search.svg" alt="" />
                  </div>
                </div>
                <div class="table-container">
                  <table id="usersTable" class="display" style="width: 100%">
                    <thead>
                      <tr style="height: 40px">
                        <th>User Name</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>
                </div>
                <div class="button__group">
                  <button type="button" class="btn-form add-btn">add</button>
                </div>
              </div>
              <div class="button__group">
                <button type="button" class="btn-form update-btn">
                  Update
                </button>
                <button type="button" class="btn-form cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      `;

      $(".main-content").html(updateProjectHTML);

      $(".cancel-btn").on("click", function () {
        window.location.href = "project.html";
      });

      $('.btn-add-member').on('click', function () {
        $('.box-add-user-project').show();
        fetchUserData();
        searchTable();
        tableUser = $("#usersTable").DataTable({
          info: false,
          paging: false,
          scrollY: '200px',
          scrollCollapse: true,
          lengthChange: false,
          searching: false,
          ordering: false,
          pagingType: "simple_numbers",
        });

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
        function populateTable(users) {
          tableUser.clear();
          users.forEach((user) => {
            const row = $(`
                  <tr data-user-id="${user._id}">
                      <td>${user.username}</td>
                      <td>${user.email}</td>
                  </tr>
              `);
            row.on('click', function () {
              $("tr").removeClass("selected");
              $(this).addClass("selected");
            });

            tableUser.row.add(row);
          });
          tableUser.draw();
        }

        $('.button__group').on('click', '.add-btn', async function () {
          const selectedUsers = [];
          $('#usersTable tbody tr.selected').each(function () {
            const userId = $(this).data('user-id');
            selectedUsers.push(userId);
          });

          if (selectedUsers.length === 0) {
            alert('Bạn cần chọn ít nhất một người dùng để thêm vào dự án.');
            return;
          }

          try {
            const addUsersResponse = await fetch(`${ENDPOINT}/projects/${projectId}/members`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ userId: selectedUsers }),
            });

            if (!addUsersResponse.ok) {
              throw new Error('Error adding members to project');
            }

            // alert('Người dùng đã được thêm vào dự án thành công!');
            console.log(selectedUsers);

            $('.box-add-user-project').hide();
            console.log('Members:', project.members);
            console.log('Selected Users:', selectedUsers);
            console.log('Combined Array:', project.members.concat(selectedUsers));
            if (!Array.isArray(project.members) || !Array.isArray(selectedUsers)) {
              console.error('Dữ liệu không phải là mảng!');
              return;
            }
            populateTableMembers(project.members.concat(selectedUsers), false);
          } catch (error) {
            console.error('Error adding members:', error);
            // alert('Không thể thêm người dùng vào dự án.');
          }
        });

      })

      $('.box-add-user-project').on('click', '.icon-x', function () {
        $('.box-add-user-project').hide();
      });

      tableMember = $("#memberTable").DataTable({
        info: false,
        paging: true,
        pageLength: 4,
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

      populateTableMembers(project.members, true);

      let memberIdsToRemove = [];
      $("#memberTable tbody").on("click", ".btn-delete", function () {
        const memberRow = $(this).closest("tr");
        const memberIdDelete = memberRow.data("member-id");
        if (!memberIdsToRemove.includes(memberIdDelete)) {
          memberIdsToRemove.push(memberIdDelete);
        }
        tableMember.row(memberRow).remove().draw();
      });


      $(".update-btn").on("click", async function () {
        const updatedProject = {
          name: $("#name").val(),
          description: $("#description").val(),
          startDate: $("#start-date").val(),
          endDate: $("#end-date").val(),
          removeMembers: memberIdsToRemove,
        };

        try {
          const updateResponse = await fetch(`${ENDPOINT}/projects/${projectId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updatedProject),
          });

          if (!updateResponse.ok) {
            throw new Error('Error updating project');
          }

          alert('Dự án đã được cập nhật thành công!');
          window.location.href = "project.html";

        } catch (error) {
          console.error('Error updating project:', error);
          alert('Không thể cập nhật dự án.');
        }
      });

    } catch (error) {
      console.error('Error fetching project details:', error);
      alert('Không thể lấy thông tin dự án.');
    }
  });
}

let tableMember;
function populateTableMembers(members, isUpdateMode = false) {
  tableMember.clear();

  members.forEach((member, index) => {
    let row;

    if (isUpdateMode) {
      row = $(`
        <tr data-member-id="${member._id}">
          <td>${index + 1}</td>
          <td>${member.username}</td>
          <td>${member.email}</td>
          <td>
            <button class="btn-delete">
              <img src="./image/icons/btn-delete.svg" alt="Delete" />
            </button>
          </td>
        </tr>
      `);
    } else {
      row = $(`
        <tr data-member-id="${member._id}">
          <td>${index + 1}</td>
          <td>${member.username}</td>
          <td>${member.email}</td>
        </tr>
      `);
    }

    tableMember.row.add(row);
  });

  tableMember.draw();
}




