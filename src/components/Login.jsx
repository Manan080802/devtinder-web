import React, { useEffect, useState } from "react";
import api from "../axios/api";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import useFetchUser from "../utils/useFetchUser";

const Login = () => {
  const [isRegister, setRegister] = useState(false);
  const [skill, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const navigate = useNavigate();
  const disPatch = useDispatch();
  const userData = useSelector((state) => state.user);
  useFetchUser();

  useEffect(() => {
    if (userData) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  // Form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    dob: "",
    password: "",
  });

  // Errors
  const [errors, setErrors] = useState({});

  // ========== Validation Logic ==========
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) error = `${name} is required`;
        else if (value.trim().length < 3)
          error = `${name} must be at least 3 characters`;
        break;

      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email format";
        break;

      case "gender":
        if (!["male", "female", "other"].includes(value))
          error = "Select a valid gender";
        break;

      case "dob":
        if (!value) {
          error = "Date of birth is required";
        } else {
          const date = new Date(value);
          if (isNaN(date.getTime())) error = "Invalid date format";
          else {
            const today = new Date();
            const age = today.getFullYear() - date.getFullYear();
            if (
              age < 18 ||
              (age === 18 &&
                (today.getMonth() < date.getMonth() ||
                  (today.getMonth() === date.getMonth() &&
                    today.getDate() < date.getDate())))
            ) {
              error = "You must be at least 18 years old";
            }
          }
        }
        break;

      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 8)
          error = "Password must be at least 8 characters";
        else if (!/[a-z]/.test(value))
          error = "Password must include a lowercase letter";
        else if (!/[A-Z]/.test(value))
          error = "Password must include an uppercase letter";
        else if (!/[0-9]/.test(value)) error = "Password must include a number";
        else if (!/[!@#$%^&*]/.test(value))
          error = "Password must include a special character";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  // Skill functions
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim().length < 2) {
      setErrors((prev) => ({
        ...prev,
        skills: "Skill must be at least 2 characters",
      }));
      return;
    }
    if (!skill.includes(skillInput.trim())) {
      setSkills([...skill, skillInput.trim()]);
      setSkillInput("");
      setErrors((prev) => ({ ...prev, skills: "" }));
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkills(skill.filter((s) => s !== skill));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (isRegister) {
      // validate all fields
      Object.keys(formData).forEach((field) => {
        const err = validateField(field, formData[field]);
        if (err) newErrors[field] = err;
      });

      if (skill.length === 0) {
        newErrors.skills = "At least one skill is required";
      }
    } else {
      // only check email + password
      ["email", "password"].forEach((field) => {
        const err = validateField(field, formData[field]);
        if (err) newErrors[field] = err;
      });
    }

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      if (isRegister) {
        const result = await api.post(
          "/auth/signup",
          { ...formData, skill },
          { withCredentials: true }
        );
        disPatch(addUser(result.data.result));

        navigate("/");
      } else {
        const result = await api.post(
          "/auth/login",
          { email: formData.email, password: formData.password },
          { withCredentials: true }
        );
        disPatch(addUser(result.data.result));

        navigate("/");
      }
    } catch (error) {
      const backendError =
        error.response?.data?.message || "Something went wrong";

      // ✅ Save error to state
      setErrors((prev) => ({
        ...prev,
        backend: backendError,
      }));

      setTimeout(() => {
        setErrors((prev) => ({
          ...prev,
          backend: null,
        }));
      }, 3000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md bg-base-300 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg text-white py-5 text-center">
          <h2 className="text-2xl font-bold">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-sm opacity-80">
            {isRegister
              ? "Join us today, it’s quick & easy"
              : "Login to continue"}
          </p>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[550px] overflow-y-auto"
        >
          {errors.backend && (
            <div className="alert alert-error text-sm text-white">
              {errors.backend}
            </div>
          )}

          {isRegister && (
            <>
              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-sm">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="label text-sm">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="label text-sm">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                )}
              </div>

              {/* Skills */}
              <div>
                <label className="label text-sm">Skills</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {skill.map((s, i) => (
                    <span
                      key={i}
                      className="badge badge-primary py-2 px-3 text-sm flex items-center"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="ml-2 hover:text-red-300"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Enter a skill"
                    className="input input-bordered w-full"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="btn btn-secondary"
                  >
                    Add
                  </button>
                </div>
                {errors.skills && (
                  <p className="text-red-500 text-xs mt-1">{errors.skills}</p>
                )}
              </div>

              {/* DOB */}
              <div>
                <label className="label text-sm">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  max={new Date().toISOString().split("T")[0]}
                />
                {errors.dob && (
                  <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                )}
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="label text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="label text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-full mt-2">
            {isRegister ? "Sign Up" : "Sign In"}
          </button>

          {/* Toggle */}
          <p className="text-sm text-gray-400 text-center mt-3">
            {isRegister ? "Already have an account? " : "New here? "}
            <button
              type="button"
              className="text-primary font-medium hover:underline"
              onClick={() => setRegister(!isRegister)}
            >
              Sign {isRegister ? "In" : "Up"} now
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
