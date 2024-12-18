import express from "express"
import Book from "../models/Book.js"

const router = express.Router()

/* Get all books in the db */
router.get("/allbooks", async (req, res) => {
    try {
        const books = await Book.find({}).populate("transactions").sort({ _id: -1 })
        res.status(200).json(books)
    }
    catch (err) {
        return res.status(504).json(err);
    }
})

/* Get Book by book Id */
router.get("/getbook/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate("transactions")
        res.status(200).json(book)
    }
    catch {
        return res.status(500).json(err)
    }
})

/* Get books by category name*/
router.get("/", async (req, res) => {
    const category = req.query.category
    try {
        const books = await BookCategory.findOne({ categoryName: category }).populate("books")
        res.status(200).json(books)
    }
    catch (err) {
        return res.status(504).json(err)
    }
})

/* Adding book */
/* Adding book */
router.post("/addbook", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            const newBook = new Book({
                bookName: req.body.bookName,
                alternateTitle: req.body.alternateTitle || "",
                author: req.body.author,
                bookCountAvailable: req.body.bookCountAvailable,
                language: req.body.language || "",
                publisher: req.body.publisher || "",
                bookStatus: req.body.bookStatus || "Available",
                categories: req.body.categories // Directly store as an array of strings
            });

            const savedBook = await newBook.save();
            res.status(200).json(savedBook);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error adding book", error: err.message });
        }
    } else {
        res.status(403).json("You don't have permission to add a book!");
    }
});


/* Addding book */
router.put("/updatebook/:id", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            await Book.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Book details updated successfully");
        }
        catch (err) {
            res.status(504).json(err);
        }
    }
    else {
        return res.status(403).json("You dont have permission to delete a book!");
    }
})

/* Remove book  */
router.delete("/removebook/:id", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            const _id = req.params.id
            const book = await Book.findOne({ _id })
            await book.remove()
            await BookCategory.updateMany({ '_id': book.categories }, { $pull: { books: book._id } });
            res.status(200).json("Book has been deleted");
        } catch (err) {
            return res.status(504).json(err);
        }
    } else {
        return res.status(403).json("You dont have permission to delete a book!");
    }
})

export default router