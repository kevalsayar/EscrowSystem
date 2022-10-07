import styles from "./dashboard.module.css";
import ReactPaginate from "react-paginate";

const Previousdeals = () => {
  const { line_height, t_head } = styles;
  const handlePageClick = (clickedPageNumber) => {
    console.log(clickedPageNumber.selected + 1);
  };

  return (
    <>
      <table className={`${line_height} w-100 table`}>
        <thead className={t_head}>
          <tr>
            <th>Deal ID</th>
            <th>Deal Title</th>
            <th>Deal Description</th>
            <th>Deal Time</th>
            <th>Deal Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>4218251</td>
            <td>hi</td>
            <td>hi</td>
            <td>14:00 - 18:00</td>
            <td>500 USD</td>
          </tr>
          <tr>
            <td>4218251</td>
            <td>hi</td>
            <td>hi</td>
            <td>14:00 - 18:00</td>
            <td>500 USD</td>
          </tr>
        </tbody>
      </table>
      <div className="paginate">
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={100}
          previousLabel="< previous"
          containerClassName="d-flex w-100 justify-content-between"
        />
      </div>
    </>
  );
};
export default Previousdeals;
