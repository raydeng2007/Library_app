import React from "react";

import "./App.css";
import { Component } from "react";
import { FormGroup, Input } from "reactstrap";
import CreateModal from "./components/Modal";
import axios from "axios";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: {
                title: "",
                author: "",
                book_id: null,
            },
            search: "",
            viewBorrowed: false,
            nextPage: null,
            prevPage: null,
            currPageNum: 1,
            totalPageNum: 0,
            bookCountAvailable: 0,
            bookCountBorrowed: 0,
            baseUrlAvailable: `http://localhost:8000/api/available/?page=`,
            baseUrlBorrowed: `http://localhost:8000/api/borrowed/?page=`,
            baseUrlBooks: `http://localhost:8000/api/books/`,
            bookList: [],
        };
    }

    componentDidMount() {
        this.refreshList();
    }

    // Each time user performs an action changing the list this gets
    // called to refresh the results as well as keeping it on the same page.
    refreshList = () => {
        if (this.state.viewBorrowed) {
            axios
                .get(this.state.baseUrlBorrowed + this.state.currPageNum)
                .then((res) => {
                    this.setState({
                        totalPageNum: Math.ceil(res.data.count / 5),
                        bookCountBorrowed: res.data.count,
                        bookList: res.data.results,
                        nextPage: res.data.next,
                        prevPage: res.data.previous,
                    });
                })
                .catch((err) => console.log(err));
        } else {
            axios
                .get(this.state.baseUrlAvailable + this.state.currPageNum)
                .then((res) => {
                    this.setState({
                        totalPageNum: Math.ceil(res.data.count / 5),
                        bookCountAvailable: res.data.count,
                        bookList: res.data.results,
                        nextPage: res.data.next,
                        prevPage: res.data.previous,
                    });
                })
                .catch((err) => console.log(err));
        }
    };

    // Toggle modal for submitting new book
    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    nextPage = () => {
        const pagenum = this.state.currPageNum;
        if (this.state.nextPage) {
            axios
                .get(this.state.nextPage)
                .then((res) =>
                    this.setState({
                        currPageNum: pagenum + 1,
                        bookList: res.data.results,
                        nextPage: res.data.next,
                        prevPage: res.data.previous,
                    })
                )
                .catch((err) => console.log(err));
        }
    };

    prevPage = () => {
        const pagenum = this.state.currPageNum;
        if (this.state.prevPage) {
            axios
                .get(this.state.prevPage)
                .then((res) =>
                    this.setState({
                        currPageNum: pagenum - 1,
                        bookList: res.data.results,
                        nextPage: res.data.next,
                        prevPage: res.data.previous,
                    })
                )
                .catch((err) => console.log(err));
        }
    };

    // Handle submission of new book.
    handleSubmit = (item) => {
        this.toggle();
        axios
            .post(this.state.baseUrlBooks, {
                title: item.title,
                author: item.author,
                is_borrowed: false,
                book_id: item.book_id,
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    // Handle creation of new modal
    createItem = () => {
        const item = { title: "", author: "" };
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    // Handle reserving of available book.
    handleReserve = (item) => {
        if (
            this.state.bookCountAvailable % 5 === 1 &&
            this.state.currPageNum === this.state.totalPageNum &&
            this.state.currPageNum !== 1
        ) {
            this.setState((prevState) => ({
                currPageNum: prevState.currPageNum - 1,
            }));
        }
        axios
            .put(`http://localhost:8000/api/reserve/books/${item.book_id}/`, {
                book_id: item.book_id,
                is_borrowed: true,
                id: item.id,
            })
            .then(this.refreshList)
            .catch(function (error) {
                console.log(error);
            });
    };

    // Handle releasing of reserved book.
    handleRelease = (item) => {
        if (
            this.state.bookCountBorrowed % 5 === 1 &&
            this.state.currPageNum === this.state.totalPageNum &&
            this.state.currPageNum !== 1
        ) {
            this.setState((prevState) => ({
                currPageNum: prevState.currPageNum - 1,
            }));
        }
        axios
            .put(`http://localhost:8000/api/reserve/books/${item.book_id}/`, {
                book_id: item.book_id,
                is_borrowed: false,
                id: item.id,
            })
            .then(this.refreshList)
            .catch(function (error) {
                console.log(error);
            });
    };

    // Handle search value
    handleChange = (item) => {
        this.setState({ search: item.target.value });
    };

    // Handle search.
    handleSearch = () => {
        axios
            .get(this.state.baseUrlBooks, {
                params: {
                    search: this.state.search,
                },
            })
            .then((res) =>
                this.setState({
                    currPageNum: 1,
                    totalPageNum: Math.ceil(res.data.count / 5),
                    viewBorrowed: false,
                    bookList: res.data.results,
                    nextPage: res.data.next,
                    prevPage: res.data.previous,
                })
            )
            .catch(function (error) {
                console.log(error);
            });
    };

    // Toggle between Available and Borrowed view.
    displayBorrowed = (status) => {
        if (status) {
            return this.setState(
                { viewBorrowed: true, currPageNum: 1 },
                this.refreshList
            );
        }
        return this.setState(
            { viewBorrowed: false, currPageNum: 1 },
            this.refreshList
        );
    };

    Search = () => {
        return (
            <FormGroup className="search">
                <Input
                    placeholder="Search Book Titles"
                    onChange={this.handleChange}
                />
                <input
                    type="button"
                    value="Search"
                    onClick={() => this.handleSearch()}
                    className="searchbtn btn btn-info"
                />
            </FormGroup>
        );
    };

    renderTabList = () => {
        return (
            <div className="my-5 tab-list">
                <span
                    onClick={() => this.displayBorrowed(true)}
                    className={this.state.viewBorrowed ? "active" : ""}
                >
                    Borrowed
                </span>
                <span
                    onClick={() => this.displayBorrowed(false)}
                    className={this.state.viewBorrowed ? "" : "active"}
                >
                    Available
                </span>
            </div>
        );
    };

    renderItems = () => {
        const { viewBorrowed } = this.state;

        const books = [this.state.bookList].pop();

        return books.map((item) => (
            <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
            >
                <span>{item.title}</span>
                <span>Author: {item.author}</span>
                <span>
                    <button
                        hidden={viewBorrowed}
                        onClick={() => this.handleReserve(item)}
                        className="btn btn-secondary mr-2"
                    >
                        {" "}
                        Reserve{" "}
                    </button>

                    <button
                        hidden={!viewBorrowed}
                        onClick={() => this.handleRelease(item)}
                        className="btn btn-secondary mr-2"
                    >
                        {" "}
                        Release{" "}
                    </button>
                </span>
            </li>
        ));
    };

    render() {
        return (
            <main className="content">
                <h1 className="text-white text-uppercase text-center my-4">
                    Library app
                </h1>
                <div className="row ">
                    <div className="col-md-6 col-sm-10 mx-auto p-0">
                        <div className="card p-3">
                            <div className="">
                                <button
                                    onClick={this.createItem}
                                    className="btn btn-primary"
                                >
                                    Add Book
                                </button>
                                {this.Search()}
                            </div>

                            {this.renderTabList()}

                            <ul className="list-group list-group-flush">
                                {this.renderItems()}
                            </ul>
                            <span className="pagenum align-items-center">
                                Page {this.state.currPageNum} /{" "}
                                {this.state.totalPageNum}
                            </span>
                        </div>

                        <div>
                            <div className="prev">
                                <button
                                    onClick={this.prevPage}
                                    className="btn btn-info"
                                >
                                    Prev Page
                                </button>
                            </div>

                            <div className="next">
                                <button
                                    onClick={this.nextPage}
                                    className="btn btn-info"
                                >
                                    Next Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.modal ? (
                    <CreateModal
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleSubmit}
                    />
                ) : null}
            </main>
        );
    }
}
export default App;
