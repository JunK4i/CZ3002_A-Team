import React from 'react';
import "../styles/Common.css";
import { Container, Row, Col } from "react-bootstrap";

/**
 * This componenet handles pagination. It passes the current selected page to the parent through the onPageChange callback.
 * 
 * @prop {int} currentPage - 
 * @prop {int} totalCount - total number of items
 * @prop {int} pageSize - number of items per page
 * @prop {function} onPageChange(currPage) - callback function to be called when page changes
 * @returns 
 */
const Pagination = ({ currentPage, totalCount, pageSize, onPageChange }) => {
    const lastPage = Math.ceil(totalCount / pageSize);
    // const [currPage, setCurrPage] = React.useState(currentPage);

    function handleClickNumber(e, newPage) {
        e.preventDefault();
        onPageChange(newPage);
    }
    function handleClickPrev(e) {
        if (currentPage > 1) {
            e.preventDefault();
            onPageChange(currentPage - 1);
        }
    }
    function handleClickNext(e) {
        if (currentPage < lastPage) {
            e.preventDefault();
            onPageChange(currentPage + 1);
        }
    }

    const leftArrow = <i className="bi bi-chevron-left" onClick={e => handleClickPrev(e)}></i>;
    const rightArrow = <i className="bi bi-chevron-right" onClick={e => handleClickNext(e)}></i>;

    const currNumber = <span style={{ fontWeight: "bold" }}>{currentPage}</span>;


    if (lastPage === 1) {
        return null
    } else if (lastPage === 2) {
        if (currentPage === 2)
            return (
                <div className="pagination">
                    {leftArrow} {1}&nbsp;-&nbsp;{currNumber} {rightArrow}
                </div>
            )
        else {
            return (
                <div className="pagination">
                    {leftArrow} {currNumber}&nbsp;-&nbsp;{2} {rightArrow}
                </div>
            )
        }
    } else {
        const leftNumber =
            (currentPage === 2) ? <span onClick={e => handleClickNumber(e, 1)}>{1}</span> // if current page is 2, then left number is 1
                : (currentPage > 2) ? <span onClick={e => handleClickNumber(e, 1)}>{1}&nbsp;...</span> // if current page is greater than 2, then left number is 1 ...
                    : currNumber; // if current page is 1, then left number is current page

        const middleNumber =
            (currentPage === 1) ? <span onClick={e => handleClickNumber(e, 2)}>2</span> // if current page is 1, then middle number is 2
                : (currentPage === lastPage) ? <span onClick={e => handleClickNumber(e, lastPage - 1)}>{lastPage - 1}</span> // if current page is last page, then middle number is last page - 1
                    : currNumber; // if current page is neither 1 nor last page, then middle number is current page

        const rightNumber =
            (currentPage === lastPage - 1) ? <span onClick={e => handleClickNumber(e, lastPage)}>{lastPage}</span> // if current page is last page -1, then right number is last page
                : (currentPage < lastPage - 1) ? <span onClick={e => handleClickNumber(e, lastPage)}>...&nbsp;{lastPage}</span> // if current page is less than last page - 1, then right number is ... last page
                    : currNumber; // if current page is last page, then right number is current page
        return (
            <div className="pagination">
                {leftArrow} {leftNumber}&nbsp;-&nbsp;{middleNumber}&nbsp;-&nbsp;{rightNumber} {rightArrow}
            </div>
        )
    }
};

export default Pagination;