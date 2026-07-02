package com.krakedev.proyectos.controllers;

import com.krakedev.proyectos.entidades.Usuario;
import com.krakedev.proyectos.security.JwtUtil;
import com.krakedev.proyectos.services.TokenBlacklistService;
import com.krakedev.proyectos.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        Usuario guardado = usuarioService.registrar(usuario);
        return ResponseEntity.ok(guardado);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        Optional<Usuario> resultado = usuarioService.login(usuario.getUsername(), usuario.getPassword());
        if (resultado.isPresent()) {
            String token = JwtUtil.generarToken(resultado.get().getUsername(), resultado.get().getRol());
            Map<String, String> respuesta = new HashMap<>();
            respuesta.put("token", token);
            respuesta.put("username", resultado.get().getUsername());
            respuesta.put("rol", resultado.get().getRol());
            return ResponseEntity.ok(respuesta);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token no proporcionado");
        }
        String token = authHeader.substring(7);
        tokenBlacklistService.agregar(token);
        return ResponseEntity.ok("Sesión cerrada correctamente");
    }

    @GetMapping("/perfil")
    public ResponseEntity<?> perfil() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        String rol = auth.getAuthorities().iterator().next().getAuthority();
        String mensaje = rol.contains("ADMIN")
                ? "Bienvenido Administrador " + username + " - Tienes acceso total"
                : "Bienvenido Usuario " + username + " - Acceso limitado";
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", mensaje);
        respuesta.put("username", username);
        respuesta.put("rol", rol);
        return ResponseEntity.ok(respuesta);
    }
}