import React from "react";
import { createRoot } from "react-dom/client";
    const App = () => {
      const proxyImage = (url) => `https://i.nanswap.com/unsafe/rs::400/plain/${url}@webp`

      const [total, setTotal] = React.useState(0);
      const [page, setPage] = React.useState(0);
      const [nanfts, setNanfts] = React.useState([]);
      const [isLoading, setIsLoading] = React.useState(true);
      const [profileAddress, setProfileAddress] = React.useState(null);
      const baseUrl = 'https://art.nanswap.com/public/collected?address='
      const urlCount = `${baseUrl}${profileAddress}&sort=mostRare&totalCount=true`
      const urlNanfts = `${baseUrl}${profileAddress}&sort=mostRare&page=${page}`

      const ButtonPage = ({ num, isActive, onClick }) => {
        return (
          <li className="mx-1 first:ml-0">
            <button
              onClick={onClick}
              className={
                isActive ?
                  "text-xs font-semibold flex w-8 h-8 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-yellow-800 bg-yellow-600 text-white"
                  :
                  "text-xs font-semibold flex w-8 h-8 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-yellow-800  bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-yellow-600 ease-linear transition-all duration-150"
              }
            >
              {num}
            </button>
          </li>
        );
      };

      const PageList = () => {
        const pageCount = Math.ceil(total / 12); // Calculate the number of pages
        const maxButtons = 5; // Set the maximum number of buttons to display
        const startPage = Math.max(0, page - Math.floor(maxButtons / 2)); // Calculate the starting page
        const endPage = Math.min(pageCount - 1, startPage + maxButtons - 1); // Calculate the ending page

        return (
          <div className="py-2 pb-3 align-middle">
            <nav className="block" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <ul className="flex px-4 sm:px-6 rounded list-none flex-wrap">
                {startPage > 0 && (
                  <>
                    <ButtonPage
                      key={0}
                      num={1}
                      isActive={0 === page}
                      onClick={() => setPage(0)}
                    />
                    {startPage > 1 && <li><i className="w-4 text-center fas fa-ellipsis-h align-bottom text-sm text-gray-400"></i></li>}
                  </>
                )}
                {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                  const pageNumber = startPage + i;
                  return (
                    <ButtonPage
                      key={pageNumber}
                      num={pageNumber + 1}
                      isActive={pageNumber === page}
                      onClick={() => setPage(pageNumber)}
                    />
                  );
                })}
                {endPage < pageCount - 1 && (
                  <>
                    {endPage < pageCount - 2 && <li><i className="w-4 text-center fas fa-ellipsis-h align-bottom text-sm text-gray-400"></i></li>}
                    <ButtonPage
                      key={pageCount - 1}
                      num={pageCount}
                      isActive={pageCount - 1 === page}
                      onClick={() => setPage(pageCount - 1)}
                    />
                  </>
                )}
              </ul>
            </nav>
          </div>
        );
      };

      React.useEffect(() => {
        if (!profileAddress) {
          return
        }
        fetch(urlCount).then((r) => r.text()).then((r) => {
          setTotal(+r)
        })
      }, [profileAddress]);

      React.useEffect(() => {
        setIsLoading(true)
        if (!profileAddress) {
          return
        }
        fetch(urlNanfts).then((r) => r.json()).then((r) => {
          setIsLoading(false)
          if (r.error) {
            return
          }
          setNanfts(r)
        })
      }, [page, profileAddress]);

      React.useEffect(() => {
        try {
            window.appbridge.getContainingProfileUserAddress().then((r) => {
                setProfileAddress(r)
            })
        } catch (error) {
            console.log("Could not get profile address", error)            
        }
      }, []);

      return (
        <div className="text-white dark:text-gray-200 p-4 text-center">

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            {
              nanfts.map((item) => {
                return (
                  <a href={`https://nanswap.com/art/assets/${item.id}`} target="_blank">
                  <div className="card" key={item.id}>
                    <img src={proxyImage(item.location)} />
                  </div>
                  </a>
                )
              })
            }
          </div>
          {
            nanfts.length === 0 && !isLoading && (
              <div >
                <p className="mb-4">
                  User has no NaNFTs
                </p>
                <a href="https://nanswap.com/art/collection/ffyvLy6VOci?&status=all" target="_blank">
                <jungletv-button>
                  JungleTV NaNFTs (Demo)
                  <i className="fas fa-external-link-alt ml-2"></i>
                </jungletv-button>
                </a>
                
              </div>
            )
          }

          <PageList />
          {
            isLoading && (
              <div className="text-center mt-2">
                <p>
                  Loading...
                </p>
              </div>
            )
          }
          <div style={{ display: "none" }}>
            {/* Hacky way to load css for the pagination button */}
            <jungletv-button color="green">
              <i className="fas fa-external-link-alt"></i>
              fake button
            </jungletv-button>
          </div>
        </div>
      );
    };
    // const  = ReactDOM.createRoot()
    const root = createRoot(document.getElementById("root"))
    root.render(<App />);