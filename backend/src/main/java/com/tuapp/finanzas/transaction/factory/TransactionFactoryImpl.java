package com.tuapp.finanzas.transaction.factory;

import com.tuapp.finanzas.category.entity.Category;
import com.tuapp.finanzas.transaction.dto.TransactionDto;
import com.tuapp.finanzas.transaction.entity.Transaction;
import com.tuapp.finanzas.transaction.entity.Transaction.TransactionType;
import com.tuapp.finanzas.user.entity.User;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
public class TransactionFactoryImpl implements TransactionFactory {

    @Override
    public Transaction create(
            TransactionDto dto,
            User user,
            TransactionType type
    ) {

        Transaction t = new Transaction();

        t.setAmount(dto.getAmount());

        t.setDate(
                dto.getDate() != null
                        ? dto.getDate()
                        : OffsetDateTime.now()
        );

        t.setDescription(dto.getDescription());

        t.setType(type);

        t.setUser(user);

        if (dto.getCategoryId() != null) {

            Category c = new Category();
            c.setId(dto.getCategoryId());

            t.setCategory(c);
        }

        return t;
    }
}