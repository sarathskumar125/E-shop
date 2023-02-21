import React, { useContext, useState } from "react";
import { Store } from "../Store";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

const AddProducts = () => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const userId = userInfo.data._id;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [discount, setDiscount] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await axios.post(
        "/api/products/addproduct",
        {
          userId,
          name,
          price,
          image,
          category,
          subCategory,
          discount, 
          countInStock,
          brand,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.data.token}` }, 
        }
      );
      toast.success(data.data.message);
      setLoading(false);
      navigate("/adminuser/myproducts");
    } catch (error) {
      toast.error(getError(error));
      setLoading(false);
    } 
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try { 
      setLoading(true);
      const { data } = await axios.post("/api/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.data.token}`,
        },
      });
      setLoading(false);
      setImage(data.secure_url);
    } catch (error) { 
      toast.error(getError(error));
      setLoading(false);
    }
  };
  return (
    <Container className="small-container my-3">
      <Helmet>
        <title>Add Product</title>
      </Helmet>
      <h1>ADD PRODUCT</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value={null}></option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Personal Care">Personal care</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="subcategory">
          <Form.Label>Sub-Category</Form.Label>
          <Form.Control
            as="select"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            required
          >
            {category === "Electronics" ? (
              <>
                <option value={null}></option>
                <option value="Mobile Phones">Mobile Phones</option>
                <option value="Laptop & Desktop">Laptops & Desktop</option>
                <option value="Smart Gadgets">Smart Gadgets</option>
                <option value="Cameras">Cameras</option>
                <option value="Others">Others</option>
              </>
            ) : null}
            {category === "Fashion" ? (
              <>
                <option value={null}></option>
                <option value="Mens">Mens</option>
                <option value="Ladies">Ladies</option>
                <option value="kids">Kids</option>
              </>
            ) : null}
            {category === "Personal Care" ? (
              <>
                <option value={null}></option>
                <option value="Skin & Hair Care">Skin & Hair Care</option>
                <option value="Perfumes">Perfumes</option>
                <option value="Makeup">Makeup</option>
                <option value="Daily Essentials">Daily Essentials</option>
                <option value="Others">Others</option>
              </>
            ) : null}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="brand">
          <Form.Label>Brand</Form.Label>
          <Form.Control
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Price (in Indian rupee)</Form.Label>
          <Form.Control
            type="number"
            min={1}
            value={price}
            onWheel={(e) => e.target.blur()}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="image">
          {/* <Form.Label>Image File</Form.Label>
          <Form.Control
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          /> */}
          {image && <img src={image} alt="" height="50" width="75" />}
        </Form.Group>
        <Form.Group className="mb-3" controlId="imageFile">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control type="file" onChange={uploadFileHandler} />
        </Form.Group>
        {loading && <Loading />}
        <Form.Group className="mb-3" controlId="discount">
          <Form.Label>Discount (in percentage)</Form.Label>
          <Form.Control
            type="number"
            min={0}
            max={99}
            value={discount}
            onWheel={(e) => e.target.blur()}
            onChange={(e) => setDiscount(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="countInStock">
          <Form.Label>Count In Stock</Form.Label>
          <Form.Control
            type="number"
            min={1}
            value={countInStock}
            onWheel={(e) => e.target.blur()}
            onChange={(e) => setCountInStock(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>
        {loading ? (
          <div className="mb-3">
            <Button type="submit" disabled>
              Post
            </Button>
          </div>
        ) : (
          <div className="mb-3">
            <Button type="submit">Post</Button>
          </div>
        )}
      </Form>
    </Container>
  );
};

export default AddProducts;
