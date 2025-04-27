package com.romanwit.minicrm.dto;

import java.util.List;

public class SynchronizationResultDto {
    private List<String> added;
    private List<String> deleted;

    public SynchronizationResultDto(List<String> added, List<String> deleted) {
        this.added = added;
        this.deleted = deleted;
    }

    public List<String> getAdded() {
        return added;
    }

    public void setAdded(List<String> added) {
        this.added = added;
    }

    public List<String> getDeleted() {
        return deleted;
    }

    public void setDeleted(List<String> deleted) {
        this.deleted = deleted;
    }
}
