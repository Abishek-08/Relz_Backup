import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import LandingPage from "../components/LandingPage";

/*
This view page is only for demo purpose in this we have make use of useDispatch(),useSelector
*/

const LandingView = () => {
  const dispatch = useDispatch();
  // const title = useSelector((state) => state.title.title);

  useEffect(() => {
    const loadData = async () => {
      // const response = await getTitle();
      // dispatch(TitleAction(response.data));
    };

    loadData();
  }, [dispatch]);

  return (
    <div className="conatiner-fluid">
      <LandingPage/>
    </div>
  );
};

export default LandingView;
