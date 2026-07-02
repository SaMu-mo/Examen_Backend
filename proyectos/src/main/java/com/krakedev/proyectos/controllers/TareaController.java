package com.krakedev.proyectos.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.krakedev.proyectos.entidades.Tarea;
import com.krakedev.proyectos.services.TareaService;

@CrossOrigin(
	    origins = "http://localhost:5173",
	    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
	    allowedHeaders = {"Authorization", "Content-Type"}
	)

@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    @Autowired
    private TareaService tareaService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/")
    public ResponseEntity<?> crearTarea(@RequestBody Tarea tarea) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(tareaService.guardar(tarea));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Prioridad no válida"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/")
    public ResponseEntity<?> listar() {
        try {
            return ResponseEntity.ok(tareaService.listar());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}