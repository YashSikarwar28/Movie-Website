import React, { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updatecount } from "./appwrite";

const api_url = "https://api.themoviedb.org/3";
const api_key = import.meta.env.VITE_TMDB_API_KEY;

const api_options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${api_key}`,
  },
};

const App = () => {
  const [searchterm, setsearchterm] = useState("");
  const [errormsg, seterrormsg] = useState("");
  const [movieslist, setmovielist] = useState([]);
  const [loading, setloading] = useState(false);



  const fetchmovie = async (query = "") => {
    setloading(true);
    try {
      const endpoint = query
        ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            query
          )}`
        : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, api_options);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      setmovielist(data.results);

      if(query && data.results.length>0){
        await updatecount(query,data.results[0])
      }
  
    } catch (error) {
      console.error(`Error : ${error}`);
      seterrormsg("Error while fetching movies");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchmovie(searchterm);
  }, [searchterm]);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without Hustle
          </h1>
          <Search searchterm={searchterm} setsearchterm={setsearchterm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[60px] text-4xl">Trending Movies</h2>
          {loading ? (
            <Spinner />
          ) : errormsg ? (
            <p className="text-red-600">{errormsg}</p>
          ) : (
            <ul>
              {movieslist.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
