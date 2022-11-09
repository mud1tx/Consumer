import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import classes from "./AddProducts.module.css";
import ImagePond from "../../components/ImagePond";

const AddProducts = () => {
  const [user, setUser] = useState({ title: "",category:"", price: "", description: "" });
  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
    // console.log(user);
  };

  return (
    <div>
      <Navbar />
      <main className={classes.addProduct_form}>
        <form
          className={classes.product_form}
          action="/admin/add-product"
          method="POST"
        >
          <div className={classes.form_control}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={user.title}
              onChange={handleInputs}
            />
          </div>
          <div className={classes.form_control}>
            <label htmlFor="category">Category</label>
            <input
              type="text"
              name="category"
              id="category"
              value={user.category}
              onChange={handleInputs}
            />
          </div>
          <div className={classes.form_control}>
            <label htmlFor="image">Choose File</label>
            <ImagePond name="image" />
          </div>
          <div className={classes.form_control}>
            <label htmlFor="price">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              value={user.price}
              onChange={handleInputs}
            />
          </div>
          <div className={classes.form_control}>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              rows="5"
              value={user.description}
              onChange={handleInputs}
            ></textarea>
          </div>
          <button
            className={classes.addProduct_form_submit_btn}
            type="submit"
          >
            Add-Product
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddProducts;
