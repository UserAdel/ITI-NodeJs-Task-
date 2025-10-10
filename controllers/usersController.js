const createSendToken = async (user, statusCode, res) => {
  const token = await signToken({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "90d",
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const signup = async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;

  // Check if passwords match
  if (password !== passwordConfirm) {
    return next(new CustomError("Passwords do not match", 400));
  }

  const newUser = await User.create({
    name,
    email,
    password,
    role: role || "user",
  });

  await createSendToken(newUser, 201, res);
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new CustomError("Please provide email and password!", 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new CustomError("Incorrect email or password", 401));
  }

  // 3) Check if user is active
  if (!user.isActive) {
    return next(
      new CustomError(
        "Your account has been deactivated. Please contact support.",
        401
      )
    );
  }

  // 4) If everything ok, send token to client
  await createSendToken(user, 200, res);
};

const getAllUsers = async (req, res) => {
  const { page, limit } = req.query;

  const skip = (page - 1) * limit;

  const query = { isActive: true };

  const usersPromise = User.find(query, { password: 0 })
    .skip(Number(skip))
    .limit(Number(limit))
    .sort({ createdAt: -1 });
  const totalPromise = User.countDocuments(query);

  const [users, total] = await Promise.all([usersPromise, totalPromise]);

  res.status(200).json({
    status: "success",
    message: "Users fetched successfully",
    data: users,
    pagination: {
      page: Number(page),
      total,
      totalPages: Math.ceil(total / Number(limit)),
      limit: Number(limit),
    },
  });
};

const getUserById = async (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return next(new CustomError("Invalid id", 400));
  }

  const user = await User.findOne({ _id: id }, { password: 0 });

  if (!user) {
    return next(new CustomError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "User fetched successfully",
    data: user,
  });
};

const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new CustomError("Name, email and password are required", 400));
  }

  const newUser = await User.create({ name, email, password });
  const savedUser = newUser.toObject();
  delete savedUser.password;

  res.json({
    status: "success",
    message: "User created successfully",
    data: savedUser,
  });
};

const updateUser = async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new CustomError("Invalid id", 400));
  }
  const { name, email } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: id },
    { name, email },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  const savedUser = user.toObject();
  delete savedUser.password;

  return res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: savedUser,
  });
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new CustomError("Invalid id", 400));
  }

  const user = await User.findOneAndDelete({ _id: id });

  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  return res.status(204).send();
};

module.exports = {
  signup,
  login,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
