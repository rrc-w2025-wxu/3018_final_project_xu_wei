
import { Request, Response } from "express";
import * as productService from "../services/Product_Service";
import { Product } from "../models/Product_Model";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Create a new product
 * POST /api/v1/products
 */
export const createProductController = async (req: Request, res: Response) => {
  try {
    const newProductData: Product = req.body;
    const newProduct = await productService.createProductService(newProductData);

    res.status(HTTP_STATUS.CREATED).json({
      message: "Product created",
      data: newProduct,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
    } else {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Unknown error" });
    }
  }
};

/**
 * Get all products
 * GET /api/v1/products
 */
export const getAllProductsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await productService.getAllProductsService();
    res.status(HTTP_STATUS.OK).json({
      message: "Products retrieved",
      count: products.length,
      data: products,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
    } else {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Unknown error" });
    }
  }
};

/**
 * Get a single product by ID
 * GET /api/v1/products/:id
 */
export const getProductController = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Product ID is required" });
    }

    const product = await productService.getProductService(id);
    if (!product) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Product not found" });
    }

    return res.status(HTTP_STATUS.OK).json({ message: "Product retrieved", data: product });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
    } else {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Unknown error" });
    }
  }
};

/**
 * Update a product by ID
 * PUT /api/v1/products/:id
 */
export const updateProductController = async (
  req: Request<{ id: string }, Partial<Product>>,
  res: Response
): Promise<Response> => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Product ID is required" });
    }

    const data: Partial<Product> = req.body;
    const updatedProduct = await productService.updateProductService(id, data);
    if (!updatedProduct) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Product not found" });
    }

    return res.status(HTTP_STATUS.OK).json({ message: "Product updated", data: updatedProduct });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
    } else {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Unknown error" });
    }
  }
};

/**
 * Delete a product by ID
 * DELETE /api/v1/products/:id
 */
export const deleteProductController = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Product ID is required" });
    }

    const deletedProduct = await productService.deleteProduct(id);
    if (!deletedProduct) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Product not found" });
    }

    return res.status(HTTP_STATUS.OK).json({ message: "Product deleted", data: deletedProduct });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
    } else {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Unknown error" });
    }
  }
};
