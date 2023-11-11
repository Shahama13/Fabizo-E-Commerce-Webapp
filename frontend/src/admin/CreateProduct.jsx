import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import {
  CurrencyRupeeIcon,
  DocumentIcon,
  RectangleGroupIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { clearproductError, productReset } from "../Reducers/product";
import { useNavigate } from "react-router-dom";
import { newProduct } from "../Actions/product";

const categories = [
  "Footwear",
  "Attire",
  "Children",
  "Tops",
  "Jeans",
  "Accessories",
  "Gadgets",
  "Home Decor",
];

const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const { loading, error, success } = useSelector(
    (state) => state.createProduct
  );

  const imageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagePreview([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    dispatch(newProduct(name, price, description, category, images));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearproductError());
    }
    if (success) {
      toast.success("Product created successfully");
      dispatch(productReset());
      navigate("/admin/dashboard");
    }
  }, [dispatch, error, success, navigate]);

  return (
    <>
      <TopBar />
      <div className="w-full items-center justify-center flex flex-col px-4 pt-2 md:p-0">
        <form
          encType="multipart/form-data"
          className="flex flex-col w-full mt-0 sm:mt-2 md:w-1/2  max-w-lg p-4 pt-1 sm:pt-4 pb-8 rounded-md bg-white shadow-lg "
          onSubmit={handlesubmit}
        >
          <div className="relative mb-3">
            <TagIcon className=" h-6 w-6 text-black absolute top-[15px] left-3" />
            <input
              className="outline-none bg-slate-100 rounded-md pl-12 py-3 pr-2 w-full"
              required
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="relative mb-3">
            <CurrencyRupeeIcon className=" h-6 w-6 text-black absolute top-[15px] left-3" />
            <input
              className="outline-none bg-slate-100 rounded-md pl-12 py-3 pr-2 w-full"
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="relative mb-3">
            <RectangleGroupIcon className=" h-6 w-6 text-black absolute top-[15px] left-3" />
            <select
              className="outline-none bg-slate-100 rounded-md pl-12 py-3 pr-2 w-full"
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" selected disabled>
                Choose category
              </option>

              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="relative mb-3">
            <DocumentIcon className=" h-6 w-6 text-black absolute top-[15px] left-3" />
            <textarea
              className="outline-none bg-slate-100 rounded-md pl-12 py-3 pr-2 w-full"
              required
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col items-center mb-3">
            <input
              className="text-sm text-gray-400"
              type="file"
              name="avatar"
              accept="image/*"
              onChange={imageChange}
              multiple
              required
            />
          </div>

          <div className="flex overflow-x-scroll">
            {imagePreview.map((image, index) => (
              <img
                key={index}
                src={image}
                className="w-20 h-20"
                alt="Preview"
              />
            ))}
          </div>

          <button
            className="bg-black hover:bg-gray-600 w-full text-white font-serif py-2 mt-2"
            type="submit"
            disabled={loading ? true : false}
          >
            {loading ? "Wait..." : "Create Product"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateProduct;