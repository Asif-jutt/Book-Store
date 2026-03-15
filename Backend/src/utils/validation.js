const Joi = require("joi");

const schemas = {
  // Auth schemas
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    fullName: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  updateProfile: Joi.object({
    fullName: Joi.string().optional(),
    bio: Joi.string().max(200).optional(),
    profilePicture: Joi.string().optional(),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
  }),

  // Book schemas
  createBook: Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    originalPrice: Joi.number().min(0).optional(),
    category: Joi.string().valid("free", "paid", "premium").required(),
    genre: Joi.string().optional(),
    language: Joi.string().optional(),
    pages: Joi.number().optional(),
    publisher: Joi.string().optional(),
  }),

  updateBook: Joi.object({
    title: Joi.string().optional(),
    author: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.number().min(0).optional(),
    originalPrice: Joi.number().min(0).optional(),
    category: Joi.string().valid("free", "paid", "premium").optional(),
    genre: Joi.string().optional(),
  }).min(1),

  pagination: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    sort: Joi.string().optional(),
  }),

  search: Joi.object({
    q: Joi.string().optional(),
    category: Joi.string().optional(),
    genre: Joi.string().optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    rating: Joi.number().min(0).max(5).optional(),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    sort: Joi.string().optional(),
  }),

  // Review schema
  createReview: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().max(1000).optional(),
  }),

  // Order schema
  createOrder: Joi.object({
    books: Joi.array().items(Joi.string()).min(1).required(),
    paymentMethod: Joi.string().valid("stripe", "paypal").required(),
  }),

  // Wishlist schema
  wishlistItem: Joi.object({
    bookId: Joi.string().required(),
  }),

  // Cart schema
  cartItem: Joi.object({
    bookId: Joi.string().required(),
    quantity: Joi.number().min(1).default(1),
  }),
};

const validate = (schema, data) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));
    return {
      valid: false,
      errors: details,
    };
  }

  return {
    valid: true,
    data: value,
  };
};

module.exports = {
  schemas,
  validate,
};
