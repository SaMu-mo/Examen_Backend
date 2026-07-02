package com.krakedev.proyectos.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.krakedev.proyectos.entidades.Empleado;
import com.krakedev.proyectos.repositories.EmpleadoRepository;

@Service
public class EmpleadoService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    public Empleado guardar(Empleado empleado) {
        return empleadoRepository.save(empleado);
    }

    public List<Empleado> listar() {
        return empleadoRepository.findAll();
    }

    public Empleado buscarPorId(int id) {
        return empleadoRepository.findById(id).orElse(null);
    }

    public Empleado actualizar(int id, Empleado empleado) {
        empleado.setId(id);
        return empleadoRepository.save(empleado);
    }

    public void eliminar(int id) {
        empleadoRepository.deleteById(id);
    }
}