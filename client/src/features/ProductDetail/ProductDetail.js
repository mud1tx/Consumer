import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { useParams } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import StripeCheckout from "react-stripe-checkout";

const ProductDetail = () => {
  const navigate = useNavigate();
  const userLoggedIn = useSelector((state) => state.authenticateUser);
  const { prodId } = useParams();
  const [prodDetail, setProdDetail] = useState(null);
  const [days, setDays] = useState("");
  // const [product, setProduct] = useState({
  //   name: "React from fb",
  //   price: 10,
  //   productBy: "facebook",
  // });

  const getProductDetailHandler = async (prodId) => {
    const res = await fetch(`http://localhost:5000/${prodId}`);
    const productData = await res.json();
    const { ok } = productData;
    console.log("data ayaa hai yaar", productData);
    if (!ok) {
      const { message } = productData;
      toast.error(`${message}`);
    } else {
      setProdDetail(productData.product);
    }
  };

  useEffect(() => {
    getProductDetailHandler(prodId);
  }, []);

  const handleFormSubmit = async () => {
    try {
      const ordersApi = await fetch("http://localhost:5000/admin/orders", {
        method: "POST",
        body: JSON.stringify({
          userId: userLoggedIn.user._id,
          prodData: prodDetail,
          days: days,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await ordersApi.json();
      navigate("/orders");
    } catch (err) {
      console.log(err);
    }
  };

  const makePayment = async (token) => {
    try {
      const makePaymentApi = await fetch(
        "https://ry7v05l6on.sse.codesandbox.io/checkout",
        {
          mode: "no-cors",
          method: "POST",
          body: JSON.stringify({
            token: token,
            prodData: prodDetail,
            days: days,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("payment hoga kya", makePaymentApi);
      if (makePaymentApi.status === 0) {
        handleFormSubmit();
      } else {
        console.log("error occured");
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  return (
    <>
      <div>
        <div className="2xl:container 2xl:mx-auto h-screen bg-backgound_white lg:py-16 lg:px-20 md:py-12 md:px-6 py-9 px-4  ">
          <div className="flex justify-center items-center px-4 py-4 lg:flex-row flex-col-reverse gap-8">
            <div className="  w-full sm:w-96 md:w-8/12 lg:w-6/12 items-center">
              <h2 className="font-semibold lg:text-4xl text-3xl lg:leading-9 leading-7 text-primary  mt-4">
                {prodDetail?.title}
              </h2>

              <p className=" font-normal text-base leading-6 text-text_color mt-8">
                {prodDetail?.description}
              </p>
              <h1 className=" font-normal  leading-6 text-text_color text-lg mt-8">
                Category:{" "}
                <span className="text-base">{prodDetail?.category}</span>
              </h1>
              <p className=" font-semibold lg:text-2xl text-xl lg:leading-6 leading-5 mt-6 ">
                {prodDetail?.price} INR
              </p>

              <button className="focus:outline-none focus:ring-2 border border-primary hover:bg-primary  duration-700 focus:ring-offset-2 focus:ring-gray-800 font-medium text-base hover:text-text_color leading-4  text-primary w-full py-5 lg:mt-12 mt-6">
                Add to shopping bag
              </button>
            </div>

            <div className=" w-full sm:w-96 md:w-8/12  lg:w-6/12  lg:gap-8 sm:gap-6 gap-4">
              <Carousel
                showStatus={false}
                showArrows={false}
                showIndicators={false}
                showThumbs={true}
              >
                {prodDetail?.image.map((img, index) => (
                  <div key={index}>
                    <img
                      className=""
                      src={`data:${prodDetail?.imageType[index]};base64,${img}`}
                      alt={`${prodDetail?.category}`}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
      <div>
        <label>Number of days you want to borrow(1 to 31)</label>
        <input
          type="number"
          min="1"
          max="31"
          name="days"
          value={days}
          onChange={(e) => {
            setDays(e.target.value);
          }}
        />
        {days && (
          <StripeCheckout
            stripeKey="pk_test_51LO0nNSBfCKAZDAkKq9TINx0QylNNPZB2VuFPQwLPnlRudxwz0x0PPTAl3I3SVjp6479PpXtgkTswBseoBwm8MWk002drvO5f4"
            token={makePayment}
            name="PAYMENT"
            image="https://picsum.photos/seed/picsum/200/300"
            currency="INR"
            amount={prodDetail.price * 100 * days}
          >
            <button
              className="hover:bg-primary shadow-lg duration-700 border border-primary text-primary hover:text-text_color focus:outline-none rounded-sm  px-2 py-1"
              type="submit"
            >
              Borrow
            </button>
          </StripeCheckout>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
