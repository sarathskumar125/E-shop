import React, { useContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SigninScreen from "./screens/SigninScreen";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet-async";
import { Store } from "./Store";
import { Link } from "react-router-dom";
import Badge from "react-bootstrap/esm/Badge";
import CartScreen from "./screens/CartScreen";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SignupScreen from "./screens/SignupScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import Button from "react-bootstrap/esm/Button";
import { useEffect } from "react";
import { getError } from "./utils";
import axios from "axios";
import SearchBox from "./components/SearchBox";
import SearchScreen from "./screens/SearchScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminUsers from "./screens/AdminUsers";
import CreateAdminUser from "./screens/CreateAdminUser";
import AdminPanel from "./screens/AdminPanel";
import SuperAdminRoute from "./components/SuperAdminRoute";
import CreateAdmin from "./screens/CreateAdmin";
import AddProducts from "./screens/AddProducts";
import AdminUserRoute from "./components/AdminUserRoute";
import PostsUserAdmin from "./screens/PostsUserAdmin";
import AdminApproval from "./screens/AdminApproval";
import SuperAdminApproval from "./screens/SuperAdminApproval";

const App = () => {
  const { state, Dispatch: ctxdispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [sidebarIsOpen, setSideBarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  // console.log(state)
  const signoutHandler = () => {
    ctxdispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    localStorage.removeItem("cartItem")
    window.location.href = "/signin";
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/products/categories");
        // console.log(data);
        setCategories(data);
      } catch (error) {
        toast.error(getError(error));
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <Helmet>
        <title>E-shop</title>
      </Helmet>
      <div
        className={
          sidebarIsOpen
            ? "d-flex flex-column site-container active-cont"
            : "d-flex flex-column site-container"
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" className="mb-3" expand="lg">
            <Container>
              <Button
                variant="dark"
                onClick={() => setSideBarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars" />
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand ><span style={{color:"grey"}}>E-shop</span></Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="primary">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown
                      title={userInfo.data.name}
                      id="basic-nav-dropdown"
                    >
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>My Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link to="/signin" className="nav-link">
                      Signin
                    </Link>
                  )}
                  {userInfo && userInfo.data.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/adminusers">
                        <NavDropdown.Item>Admin-Users List</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/pendingapprovals">
                        <NavDropdown.Item>Pending Approvals</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/createadminuser">
                        <NavDropdown.Item>Add Admin Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                  {userInfo && userInfo.data.isSuperAdmin && (
                    <NavDropdown title="Super-Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/superadmin/adminpanel">
                        <NavDropdown.Item>Admin-Panel</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/superadmin/pendingverifications">
                        <NavDropdown.Item>Pending Verifications</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/superadmin/createadmin">
                        <NavDropdown.Item>Add new Admin</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                  {userInfo && userInfo.data.isAdminUser && (
                    <NavDropdown title="Admin-User" id="admin-nav-dropdown">
                      <LinkContainer to="/adminuser/addproducts">
                        <NavDropdown.Item>Add Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/adminuser/myproducts">
                        <NavDropdown.Item>My Products</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-column"
              : "side-navbar d-flex justify-content-between flex-wrap flex-column"
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={{ pathname: "/search", search: `category=${category}` }}
                  onClick={() => setSideBarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container>
            <Routes>
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/" element={<HomeScreen />} />
              <Route path="product/:id" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/search" element={<SearchScreen />} />

              {/* admin-User Routes */}
              <Route
                path="/adminuser/addproducts"
                element={
                   <AdminUserRoute>
                    <AddProducts />
                    </AdminUserRoute>
                }
                />
              <Route
                path="/adminuser/myproducts" 
                element={
                   <AdminUserRoute>
                    <PostsUserAdmin /> 
                    </AdminUserRoute>
                } 
              />
              {/* admin Routes */}
              <Route 
                path="/admin/adminusers"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/createadminuser"
                element={
                  <AdminRoute>
                    <CreateAdminUser />
                  </AdminRoute> 
                }
              />
              <Route
                path="/admin/pendingapprovals"
                element={
                  <AdminRoute>
                    <AdminApproval /> 
                  </AdminRoute>
                }
              />

              {/* Super-Admin Routes */}
              <Route 
              path="/superadmin/adminpanel"
              element={
              <SuperAdminRoute>
              <AdminPanel />
              </SuperAdminRoute>
              }
              />
              <Route 
              path="/superadmin/createadmin"
              element={
              <SuperAdminRoute>
              <CreateAdmin />
              </SuperAdminRoute>
              }
              />
              <Route 
              path="/superadmin/pendingverifications"
              element={
              <SuperAdminRoute>
              <SuperAdminApproval />
              </SuperAdminRoute>
              }
              />
             
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
