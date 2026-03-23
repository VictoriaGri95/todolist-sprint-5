import { Main } from "@/app/Main"
import { FAQ, PageNotFound } from "@/common/components"
import { Login } from "@/features/auth/ui/Login/Login"
import { Route, Routes } from "react-router"
import { ProtectedRoutes } from "@/common/components/ProtectedRoute/ProtectedRoutes.tsx"
import { useAppSelector } from "@/common/hooks"
import { selectIsLoggedIn } from "@/features/auth/model/auth-slice.ts"

export const Path = {
  Main: "/",
  Login: "/login",
  FAQ: "/faq",
  NotFound: "*",
} as const

export const Routing = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  return (
    <Routes>
      <Route element={<ProtectedRoutes redirectPath={Path.Login} isAllowed={!isLoggedIn} />}>
        <Route path={Path.Main} element={<Main />} />
        <Route path={Path.FAQ} element={<FAQ />} />
      </Route>

      <Route element={<ProtectedRoutes redirectPath={Path.Main} isAllowed={isLoggedIn} />}>
        <Route path={Path.Login} element={<Login />} />
      </Route>

      <Route path={Path.NotFound} element={<PageNotFound />} />
    </Routes>
  )
}
