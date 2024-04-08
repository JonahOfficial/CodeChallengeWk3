document.addEventListener('DOMContentLoaded', function() {

    // Fetch the details of the movie
    fetchMovieDetails(1);

    // Fetch the list of movies
    fetchMovieList();

    // An event listener for buying tickets
    const buyTicketBtn = document.getElementById('buy-ticket');

    buyTicketBtn.addEventListener('click', function() {
      // Implemented buy ticket functionality
      fetch('http://localhost:3000/films/1')
        .then(response => response.json())
        .then(movie => {
          if (movie.tickets_sold < movie.capacity) {
            const updatedTicketsSold = movie.tickets_sold + 1;
            fetch('http://localhost:3000/films/1' , {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ tickets_sold: updatedTicketsSold })
            })
            .then(response => response.json())
            .then(updatedMovie => {
              fetchMovieDetails(updatedMovie.id);
            });
            fetch('http://localhost:3000/tickets', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ film_id: "1", number_of_tickets: 1 })
            });
          }
        });
    });

    // An event listener for deleting a movie
    const deleteMovieBtn = document.getElementById('delete-movie');
    deleteMovieBtn.addEventListener('click', function() {
      // Implemented delete movie functionality
      fetch("http://localhost:3000/films/1", {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          fetchMovieList();
          fetchMovieDetails(1);
        }
      });
    });

    function fetchMovieDetails(movieId) {
      fetch(`http://localhost:3000/films/${movieId}`)
        .then(response => response.json())
        .then(movie => {
            const posterImg = document.getElementById('poster');
            posterImg.src = movie.poster;
            const titleDiv = document.getElementById('title');
            titleDiv.textContent = movie.title;
            const runtimeDiv = document.getElementById('runtime');
            runtimeDiv.textContent = `${movie.runtime} minutes`;
            const filmInfoDiv = document.getElementById('film-info');
            filmInfoDiv.textContent = movie.description;
            const showtimeSpan = document.getElementById('showtime');
            showtimeSpan.textContent = movie.showtime;
          const availableTickets = movie.capacity - movie.tickets_sold;
          const ticketNumSpan = document.getElementById('ticket-num');
          ticketNumSpan.textContent = `${availableTickets} remaining tickets`;
          if (availableTickets === 0) {
            buyTicketBtn.textContent = "Sold Out";
            buyTicketBtn.disabled = true;
          }
        });
    }

    function fetchMovieList() {
      fetch("http://localhost:3000/films")
        .then(response => response.json())
        .then(movies => {
            const filmsList = document.getElementById('films');
            filmsList.innerHTML = '';
            movies.forEach(movie => {
            const li = document.createElement('li');
            li.classList.add('film', 'item');
            li.textContent = movie.title;
            if (movie.tickets_sold === movie.capacity) {
              li.classList.add('sold-out');
            }
            filmsList.appendChild(li);
          });
        });
    }
  });