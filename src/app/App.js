import { Provider } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import AuthInit from 'src/features/Auth/AuthInit'
import ScrollToTop from 'src/layout/_core/ScrollToTop'
import Telesales from 'src/features/Telesales'
import TelesalesList from 'src/features/Telesales/pages/TelesalesList'
import TelesalesDetail from 'src/features/Telesales/pages/TelesalesDetail'
import TelesalesOptionServices from 'src/features/Telesales/pages/TelesalesOption/TelesalesOptionServices'
import TelesalesOptionProducts from 'src/features/Telesales/pages/TelesalesOption/TelesalesOptionProducts'
import TelesalesOptionBuying from 'src/features/Telesales/pages/TelesalesOption/TelesalesOptionBuying'
import TelesalesOptionUse from 'src/features/Telesales/pages/TelesalesOption/TelesalesOptionUse'

function App({ store, persistor }) {
  return (
    <Provider store={store}>
      <PersistGate loading={'Đang tải ...'} persistor={persistor}>
        <AuthInit>
          <ScrollToTop>
            <Routes>
              <Route path="/">
                <Route index element={<Navigate to="/danh-sach" replace />} />
              </Route>
              <Route path="/danh-sach" element={<Telesales />}>
                <Route index element={<TelesalesList />} />
                <Route path=":MemberID" element={<TelesalesDetail />}>
                  <Route index element={<Navigate to="dich-vu" replace />} />
                  <Route path="dich-vu" element={<TelesalesOptionServices />} />
                  <Route
                    path="san-pham"
                    element={<TelesalesOptionProducts />}
                  />
                  <Route
                    path="lich-su-mua-hang"
                    element={<TelesalesOptionBuying />}
                  />
                  <Route
                    path="lich-su-du-dung-dv"
                    element={<TelesalesOptionUse />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to="/dich-vu" replace />}
                  />
                </Route>
              </Route>
              <Route
                path="/telesales/index.html"
                element={<Navigate to="/" replace />}
              />
            </Routes>
          </ScrollToTop>
        </AuthInit>
      </PersistGate>
    </Provider>
  )
}

export default App
