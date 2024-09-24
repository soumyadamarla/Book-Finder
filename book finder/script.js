const API_KEY = 'AIzaSyBbLdFyA_RIEZONf-96LZh7WMv_TK7GEPs';
const searchResultsContainer = document.getElementById('searchResults');
const favoriteBooksContainer = document.getElementById('favoriteBooks');

// Search Books Function
function searchBooks() {
  const searchQuery = document.getElementById('searchInput').value;
  if (searchQuery) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key=${API_KEY}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        displaySearchResults(data.items);
      })
      .catch(error => console.error('Error fetching data:', error));
  }
}

// Display Search Results
function displaySearchResults(books) {
  searchResultsContainer.innerHTML = ''; // Clear previous results
  if (books && books.length > 0) {
    books.forEach(book => {
      const bookInfo = book.volumeInfo;
      const bookCard = document.createElement('div');
      bookCard.classList.add('book-card');
      bookCard.innerHTML = `
        <img src="${bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : 'https://via.placeholder.com/100x150'}" alt="${bookInfo.title}">
        <h3>${bookInfo.title}</h3>
        <p>Author: ${bookInfo.authors ? bookInfo.authors.join(', ') : 'N/A'}</p>
        <p>Published: ${bookInfo.publishedDate || 'N/A'}</p>
        <button onclick="bookmarkBook('${book.id}')">Bookmark</button>
      `;
      searchResultsContainer.appendChild(bookCard);
    });
  } else {
    searchResultsContainer.innerHTML = '<p>No results found.</p>';
  }
}

// Bookmark Book Function
function bookmarkBook(bookId) {
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  if (!bookmarks.includes(bookId)) {
    bookmarks.push(bookId);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    alert('Book added to favorites!');
    displayBookmarkedBooks();
  } else {
    alert('Book is already in favorites.');
  }
}

// Display Bookmarked Books
function displayBookmarkedBooks() {
  favoriteBooksContainer.innerHTML = ''; // Clear previous bookmarks
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  if (bookmarks.length > 0) {
    bookmarks.forEach(bookId => {
      const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`;
      fetch(url)
        .then(response => response.json())
        .then(book => {
          const bookInfo = book.volumeInfo;
          const bookCard = document.createElement('div');
          bookCard.classList.add('book-card');
          bookCard.innerHTML = `
            <img src="${bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : 'https://via.placeholder.com/100x150'}" alt="${bookInfo.title}">
            <h3>${bookInfo.title}</h3>
            <p>Author: ${bookInfo.authors ? bookInfo.authors.join(', ') : 'N/A'}</p>
            <p>Published: ${bookInfo.publishedDate || 'N/A'}</p>
          `;
          favoriteBooksContainer.appendChild(bookCard);
        })
        .catch(error => console.error('Error fetching bookmarked book:', error));
    });
  } else {
    favoriteBooksContainer.innerHTML = '<p>No favorite books yet.</p>';
  }
}

// Load Bookmarked Books on Page Load
window.onload = function() {
  displayBookmarkedBooks();
};
