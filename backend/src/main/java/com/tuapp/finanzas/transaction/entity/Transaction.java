package com.tuapp.finanzas.transaction.entity;

import com.tuapp.finanzas.category.entity.Category;
import com.tuapp.finanzas.user.entity.User;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "transaction")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private java.math.BigDecimal amount;

    @Column(name = "date", nullable = false)
    private java.time.OffsetDateTime date;

    private String description;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public enum TransactionType {
    INCOME,
    EXPENSE
    }
    public Transaction() {}

    public Transaction(Long id, java.math.BigDecimal amount, String description, Category category, User user, java.time.OffsetDateTime date) {
        this.id = id;
        this.amount = amount;
        this.description = description;
        this.category = category;
        this.user = user;
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public java.math.BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(java.math.BigDecimal amount) {
        this.amount = amount;
    }

    public java.time.OffsetDateTime getDate() {
        return date;
    }

    public void setDate(java.time.OffsetDateTime date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
