import './App.css';
import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import * as BooksAPI from './BooksAPI'

function App() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState(null)
  const [allItem, setAllItem] = useState([]);
  const [backHome, setBackHome] = useState(false);
  const updateData = async (e, item) => {
    await BooksAPI.update(item, e.target.value)
    backHome ? setBackHome(false) : setBackHome(true)
  }
  useEffect(() => {
    async function searchData() {
      const clone = []
      BooksAPI.getAll().then(item => setAllItem(item))
      if (!query) return
      try {
        await BooksAPI.search(query).then(item => item.map((i) => clone.push(i)))
      } catch (e) {
        console.log(e)
      }
      setBooks(clone)
    }
    searchData();


  }, [query, backHome])
  function PageSearch() {
    let setTime = 0;
    const textChange = (e) => {
      const edit = e.target.value
      clearTimeout(setTime)
      setTime = setTimeout(() => {
        setQuery(edit)
        if (edit.length === 0) {
          return
        }
      }, 1000)


    }

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/">
            <button className="close-search" onClick={() => setBackHome(true)} >Close</button>
          </Link>
          <div className="search-books-input-wrapper">
            {/*
            NOTES: The search from BooksAPI is limited to a particular set of search terms.
            You can find these search terms here:
            https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md
  
            However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
            you don't find a specific author or title. Every search is limited by search terms.
          */}

            <input type="text" placeholder="Search by title or author (Example : react)" onChange={(e) => textChange(e)} />

          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {books.map(item => (
              <li key={item.id}>
                <div className="book">
                  <div className="book-top">
                    <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${item.imageLinks.smallThumbnail})` }}></div>
                    <div className="book-shelf-changer">
                      <select defaultValue={'move'} onChange={(e) => updateData(e, item)}>
                        <option value="move" disabled   >Move to...</option>
                        <option value="currentlyReading">Currently Reading</option>
                        <option value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none" >None</option>
                      </select>
                    </div>
                  </div>
                  <div className="book-title">{item.title}</div>
                  <div className="book-authors">{item.authors}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    )
  }
  function ListBook() {
    const Card = ({ item }) => {
      return (
        <li key={item.id}>
          <div className="book">
            <div className="book-top">
              <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${item.imageLinks.smallThumbnail})` }}></div>
              <div className="book-shelf-changer">
                <select defaultValue={'move'} onChange={(e) => updateData(e, item)}>
                  <option value="move" disabled   >Move to...</option>
                  <option value="currentlyReading">Currently Reading</option>
                  <option value="wantToRead">Want to Read</option>
                  <option value="read">Read</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
            <div className="book-title">{item.title}</div>
            <div className="book-authors">{item.authors}</div>
          </div>
        </li>
      )
    }
    const CurrentlyReading = allItem.map(item => {
      if (item.shelf === 'currentlyReading')
        return (
          <Card key={item.id} item={item} />
        )
      else return null

    })
    const WantToRead = allItem.map(item => {
      if (item.shelf === 'wantToRead')
        return (
          <Card key={item.id} item={item} />
        )
      else return null

    })
    const Read = allItem.map(item => {
      if (item.shelf === 'read')
        return (
          <Card key={item.id} item={item} />
        )
      else return null

    })
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            <div className="bookshelf">
              <h2 className="bookshelf-title">Currently Reading</h2>
              <div className="bookshelf-books">
                <ol className="books-grid">
                  {
                    CurrentlyReading
                  }
                </ol>
              </div>
            </div>
            <div className="bookshelf">
              <h2 className="bookshelf-title">Want to Read</h2>
              <div className="bookshelf-books">
                <ol className="books-grid">
                  {WantToRead}

                </ol>
              </div>
            </div>
            <div className="bookshelf">
              <h2 className="bookshelf-title">Read</h2>
              <div className="bookshelf-books">
                <ol className="books-grid">
                  {Read}
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="open-search">
          <Link to="/PageSearch">
            <button  >Add a book</button>
          </Link>
        </div>
      </div>
    )
  }


  return (

    <Router >
      <div className="app">
        <Switch>
          <Route path="/PageSearch">
            <PageSearch />
          </Route>

          <Route path="/">
            <ListBook />
          </Route>
        </Switch>
      </div>
    </Router >
  )
}




export default App;
