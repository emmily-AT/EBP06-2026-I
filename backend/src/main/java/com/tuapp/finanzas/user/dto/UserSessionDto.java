package com.tuapp.finanzas.user.dto;

import java.time.LocalDateTime;

public class UserSessionDto {
    private Long id;
    private String device;
    private String ipAddress;
    private LocalDateTime lastActivity;

    public UserSessionDto() {}

    public UserSessionDto(Long id, String device, String ipAddress, LocalDateTime lastActivity) {
        this.id = id;
        this.device = device;
        this.ipAddress = ipAddress;
        this.lastActivity = lastActivity;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDevice() { return device; }
    public void setDevice(String device) { this.device = device; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public LocalDateTime getLastActivity() { return lastActivity; }
    public void setLastActivity(LocalDateTime lastActivity) { this.lastActivity = lastActivity; }
}
