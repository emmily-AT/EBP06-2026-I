package com.tuapp.finanzas.category.service;

import com.tuapp.finanzas.category.dto.CategoryDto;

import java.util.List;

public interface CategoryService {
    CategoryDto create(CategoryDto dto);
    List<CategoryDto> findAll();
    CategoryDto findById(Long id);
}
