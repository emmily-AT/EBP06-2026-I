package com.tuapp.finanzas.category.service.impl;

import com.tuapp.finanzas.category.dto.CategoryDto;
import com.tuapp.finanzas.category.entity.Category;
import com.tuapp.finanzas.category.repository.CategoryRepository;
import com.tuapp.finanzas.category.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public CategoryDto create(CategoryDto dto) {
        Category c = new Category();
        c.setName(dto.getName());
        Category saved = categoryRepository.save(c);
        return toDto(saved);
    }

    @Override
    public List<CategoryDto> findAll() {
        return categoryRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public CategoryDto findById(Long id) {
        return categoryRepository.findById(id).map(this::toDto).orElse(null);
    }

    private CategoryDto toDto(Category c) {
        return new CategoryDto(c.getId(), c.getName());
    }
}
