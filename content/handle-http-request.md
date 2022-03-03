---
title: Handle HTTP Request
excerpt: Typically data is not stored in front-end interface. It is important to tackle the data fetched from backend server. Learn how to do that by going through a demo application - Star War Movies.
image: interface.png
isFeatured: true
date: '2022-1-11'
---

This is a note for [a great React course](https://www.udemy.com/course/react-the-complete-guide-incl-redux/) on Udemy developed by [Maximilian Schwarzmüller](https://www.udemy.com/user/maximilian-schwarzmuller/)

# Demo 5: Star War Movies (Sending HTTP requests)

[Completed code in Github Repository](https://github.com/Zhenyuan-Li/Udemy-React-v2.0/tree/main/5_StarWar_Movies)

## Fairly Familiar Topic for Me, Hence Less Notes

### Things to pay attention on:

When sending request in useEffect(), to avoid the infinite loop, wrap the request function in useCallback()

```jsx
const fetchMoviesHandler = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await fetch('https://swapi.dev/api/films/');
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    const data = await response.json();

    const transformedMovie = data.results.map((movieData) => {
      return {
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      };
    });

    setMovies(transformedMovie);
  } catch (error) {
    setError(error.message);
  }

  // stop loading no matter success or fail.
  setIsLoading(false);
}, []);

const addMovieHandler = async (movie) => {
  const response = await fetch('https://something.com/movies.json', {
    method: 'POST',
    body: JSON.stringify(movie),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  console.log(data);
};

// Function is object, so it will change each time re-render the Comp.
// Hence if add it to the dependency, there is a infinite loop.
// We could omit it of course, but subtle bugs exist when the function involves external states.
// Solution: useCallback();
useEffect(() => {
  fetchMoviesHandler();
}, [fetchMoviesHandler]);
```

JS object to JSON(in request body): JSON.stringify(); On the contrary: response.json()

isLoading & error normally are not globalized state. Using conditional rendering to handle each cases:

state && Comp.; Or let abc = default, use if to change the content of abc.

```jsx
let content = <p>Found No movies...</p>;
if (movies.length > 0) {
  content = <MoviesList movies={movies} />;
}
if (error) {
  content = error;
}
if (isLoading) {
  content = <p>Loading...</p>;
}

return (
  <React.Fragment>
    <section>
      <AddMovie onAddMovie={addMovieHandler} />
    </section>
    <section>
      <button onClick={fetchMoviesHandler}>Fetch Movies</button>
    </section>
    <section>{content}</section>
  </React.Fragment>
);
```
