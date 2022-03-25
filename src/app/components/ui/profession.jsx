import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { getProfessionById, getProfessionLoadingStatus, loadProfessionList } from "../../store/professions";

const Profession = ({ id }) => {
    console.log(id);
    const dispatch = useDispatch();
    const isLoading = useSelector(getProfessionLoadingStatus());
    const prof = useSelector(getProfessionById(id));
    useEffect(() => {
       dispatch(loadProfessionList());
    }, []);
    console.log("prof", prof);
    if (!isLoading) {
        return <p>{prof.name}</p>;
    } else return "Loading...";
};
Profession.propTypes = {
    id: PropTypes.string
};
export default Profession;
