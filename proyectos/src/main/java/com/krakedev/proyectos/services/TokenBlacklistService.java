package com.krakedev.proyectos.services;

import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Service
public class TokenBlacklistService {

    private final Set<String> blacklist = Collections.synchronizedSet(new HashSet<>());

    public void agregar(String token) {
        blacklist.add(token);
    }

    public boolean estaEnBlacklist(String token) {
        return blacklist.contains(token);
    }
}