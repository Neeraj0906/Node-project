const { body, validationResult } = require('express-validator');
const Recipe = require('../models/recipeModel');
const mongoose = require('mongoose');

// Validation rules for recipe fields
const recipeValidationRules = () => {
    return [
        body('name').notEmpty().withMessage('Name is required.'),
        body('ingredients').isArray().withMessage('Ingredients must be an array.'),
        body('instructions').notEmpty().withMessage('Instructions are required.'),
    ];
};

// Create Recipe
exports.createRecipe = [
    recipeValidationRules(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const recipe = new Recipe(req.body);
            await recipe.save();
            res.status(201).json(recipe);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
];

// Get All Recipes
exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Recipe by ID
exports.getRecipeById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid recipe ID format" });
    }
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Recipe
exports.updateRecipe = [
    recipeValidationRules(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid recipe ID format" });
        }

        try {
            const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!recipe) return res.status(404).json({ message: "Recipe not found" });
            res.status(200).json(recipe);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
];

// Delete Recipe
exports.deleteRecipe = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid recipe ID format" });
    }
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });
        res.status(200).json({ message: "Recipe deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
