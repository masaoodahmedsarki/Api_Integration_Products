
const productContainer = document.getElementById("productContainer");
const searchInput = document.getElementById("searchInput");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const pagination = document.getElementById("pagination");

const Api_URl = "https://fakestoreapi.noksha.dev/api/users";

let current_page = 1;
let totalUsers = 0;
let productPerPage = 10;

let allUsers = [];
let filteredUsers = [];


// Fetch Users from API
const getProducts = async () => {
    try {
        loading.style.display = "block";
        error.innerText = "";

        const response = await fetch(Api_URl);

        if (!response.ok) {
            throw new Error("API error");
        }

        const data = await response.json();

        // API se users ka data
        allUsers = data.data;

        filteredUsers = [...allUsers];
        totalUsers = filteredUsers.length;

        displayProducts();

        createPagination();

    } catch (err) {
        error.innerText = "Failed To Fetch Users";
        console.log(err);

    } finally {
        loading.style.display = "none";
    }
};


// Display Users
const displayProducts = () => {
    productContainer.innerHTML = "";

    const startIndex = (current_page - 1) * productPerPage;
    const endIndex = startIndex + productPerPage;

    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    if (currentUsers.length === 0) {
        productContainer.innerHTML = `
            <h2>No User Found</h2>
        `;
        return;
    }

    currentUsers.forEach((element) => {
        const card = document.createElement("div");
        card.classList.add("product");

        card.innerHTML = `
            <span class="category">
                ${element.role}
            </span>

            <h2>${element.name}</h2>

            <p><strong>Username:</strong> ${element.username}</p>

            <p><strong>Email:</strong> ${element.email}</p>

            <p><strong>City:</strong> ${element.address?.city || "N/A"}</p>

            <p><strong>Phone:</strong> ${element.phone || "N/A"}</p>

            <p><strong>Company:</strong> ${element.company?.name || "N/A"}</p>

            <span class="status ${element.status?.toLowerCase()}">
                ${element.status || "Unknown"}
            </span>
        `;

        productContainer.appendChild(card);
    });
};


// Create Pagination Buttons
const createPagination = () => {
    pagination.innerHTML = "";

    totalUsers = filteredUsers.length;

    const totalBtn = Math.ceil(totalUsers / productPerPage);

    if (totalBtn === 0) {
        return;
    }

    // Previous Button
    const previousBtn = document.createElement("button");
    previousBtn.innerText = "Back";
    previousBtn.disabled = current_page === 1;

    previousBtn.addEventListener("click", () => {
        if (current_page > 1) {
            current_page--;
            displayProducts();
            createPagination();
        }
    });

    pagination.appendChild(previousBtn);

    // Page Number Buttons
    for (let pageNo = 1; pageNo <= totalBtn; pageNo++) {
        const newBtn = document.createElement("button");

        newBtn.innerText = pageNo;

        // Current page button disabled
        newBtn.disabled = current_page === pageNo;
        newBtn.classList.toggle("active", current_page === pageNo);

        newBtn.addEventListener("click", () => {
            current_page = pageNo;

            displayProducts();
            createPagination();
        });

        pagination.appendChild(newBtn);
    }

    // Next Button
    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Next";
    nextBtn.disabled = current_page === totalBtn;

    nextBtn.addEventListener("click", () => {
        if (current_page < totalBtn) {
            current_page++;
            displayProducts();
            createPagination();
        }
    });

    pagination.appendChild(nextBtn);
};


// Search Users
searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase().trim();

    filteredUsers = allUsers.filter((user) => {
        return (
            user.name.toLowerCase().includes(searchText) ||
            user.username.toLowerCase().includes(searchText) ||
            user.email.toLowerCase().includes(searchText) ||
            user.address.city.toLowerCase().includes(searchText) ||
            user.role.toLowerCase().includes(searchText)
        );
    });

    // Search ke baad first page par wapas
    current_page = 1;

    displayProducts();
    createPagination();
});


// Initial API Call
getProducts();