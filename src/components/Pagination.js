export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <>
      <nav className="d-flex justify-content-center mt-5 mb-4">
        <div className="pagination-container-modern">
          <ul className="pagination-modern">
            <li
              className={`page-item-modern ${
                currentPage === 1 ? "disabled" : ""
              }`}
            >
              <button
                className="page-link-modern prev-next"
                onClick={handlePrevious}
                disabled={currentPage === 1}
                type="button"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
                <span>Previous</span>
              </button>
            </li>

            {startPage > 1 && (
              <>
                <li className="page-item-modern">
                  <button
                    className="page-link-modern page-number"
                    onClick={() => handlePageClick(1)}
                    type="button"
                  >
                    1
                  </button>
                </li>
                {startPage > 2 && (
                  <li className="page-item-modern disabled">
                    <span className="page-link-modern dots">...</span>
                  </li>
                )}
              </>
            )}

            {pages.map((page) => (
              <li
                key={page}
                className={`page-item-modern ${
                  currentPage === page ? "active" : ""
                }`}
              >
                <button
                  className={`page-link-modern page-number ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => handlePageClick(page)}
                  type="button"
                >
                  {page}
                </button>
              </li>
            ))}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && (
                  <li className="page-item-modern disabled">
                    <span className="page-link-modern dots">...</span>
                  </li>
                )}
                <li className="page-item-modern">
                  <button
                    className="page-link-modern page-number"
                    onClick={() => handlePageClick(totalPages)}
                    type="button"
                  >
                    {totalPages}
                  </button>
                </li>
              </>
            )}

            <li
              className={`page-item-modern ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link-modern prev-next"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                type="button"
              >
                <span>Next</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <style jsx>{`
        .pagination-container-modern {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 8px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .pagination-modern {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .page-item-modern {
          margin: 0;
        }

        .page-item-modern.disabled .page-link-modern {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        .page-link-modern {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 44px;
          height: 44px;
          background: transparent;
          border: 2px solid transparent;
          border-radius: 12px;
          color: #333;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .page-link-modern:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 10px;
        }

        .page-link-modern:hover:before {
          opacity: 0.1;
        }

        .page-link-modern:hover {
          border-color: #ffd700;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
        }

        .page-number {
          position: relative;
          z-index: 1;
        }

        .page-number.active {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          border-color: #ffd700;
          color: #000;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
        }

        .page-number.active:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(255, 215, 0, 0.5);
        }

        .prev-next {
          gap: 6px;
          padding: 0 16px;
          min-width: auto;
          font-size: 0.85rem;
        }

        .prev-next svg {
          transition: transform 0.3s ease;
        }

        .prev-next:hover svg {
          transform: translateX(2px);
        }

        .prev-next:first-child:hover svg {
          transform: translateX(-2px);
        }

        .dots {
          color: #666;
          font-weight: bold;
          cursor: default;
          border: none;
        }

        .dots:hover {
          background: transparent;
          border-color: transparent;
          transform: none;
          box-shadow: none;
        }

        .page-link-modern {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (max-width: 768px) {
          .pagination-container-modern {
            padding: 6px;
            border-radius: 16px;
          }

          .page-link-modern {
            min-width: 40px;
            height: 40px;
            font-size: 0.8rem;
          }

          .prev-next {
            padding: 0 12px;
          }

          .prev-next span {
            display: none;
          }

          .pagination-modern {
            gap: 2px;
          }
        }

        @media (max-width: 480px) {
          .page-link-modern {
            min-width: 36px;
            height: 36px;
            font-size: 0.75rem;
          }

          .pagination-container-modern {
            padding: 4px;
            border-radius: 14px;
          }
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
          }
          50% {
            box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
          }
          100% {
            box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
          }
        }

        .page-number.active {
          animation: pulse 2s infinite;
        }

        .pagination-container-modern {
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
