package com.romanwit.minicrm.repository;

import com.romanwit.minicrm.model.FixedListValue;
import org.springframework.data.jpa.repository.JpaRepository;
import com.romanwit.minicrm.dto.FixedListValueDto;
import java.util.List;

public interface FixedListValueRepository extends JpaRepository<FixedListValue, Long> {

    List<FixedListValueDto> findAllBy();

    List<FixedListValueDto> findByPropertyId(Long propertyId);

    boolean existsByPropertyIdAndValue(Long propertyId, String value);

}
