import PropTypes from 'prop-types';

function Pagination({ pagination, changePage }) {
  const handleClick = (e, page) => {
    e.preventDefault();
    changePage(page);
  };

  return (
    <nav aria-label='Page navigation'>
      <ul className='pagination'>
        <li className='page-item'>
          <a
            className={`page-link ${pagination.has_pre ? '' : 'disabled'}`}
            href='#'
            aria-label='Previous'
            onClick={(e) => handleClick(e, pagination.current_page - 1)}
          >
            <span aria-hidden='true'>&laquo;</span>
          </a>
        </li>
        {Array.from({ length: pagination.total_pages }).map((_, index) => (
          <li className='page-item' key={`${index}_page`}>
            <a
              className={`page-link ${
                index + 1 === pagination.current_page && 'active'
              }`}
              href='#'
              onClick={(e) => handleClick(e, index + 1)}
            >
              {index + 1}
            </a>
          </li>
        ))}
        <li className='page-item'>
          <a
            className={`page-link ${pagination.has_next ? '' : 'disabled'}`}
            href='#'
            aria-label='Next'
            onClick={(e) => handleClick(e, pagination.current_page + 1)}
          >
            <span aria-hidden='true'>&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

Pagination.propTypes = {
  pagination: PropTypes.shape({
    total_pages: PropTypes.number,
    current_page: PropTypes.number,
    has_pre: PropTypes.bool,
    has_next: PropTypes.bool,
  }),
  changePage: PropTypes.func.isRequired,
};

export default Pagination;
