package com.rts.cap.model;

import java.util.List;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * @author sanjay.subramani , dharshsun.s
 * @since 27-06-2024
 * @version 1.0
 */

@XmlRootElement(name = "TestCases")
@XmlAccessorType(XmlAccessType.FIELD)
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TestCases {

	@XmlElement(name = "TestCase")
	private List<TestCase> testCaseList;

	

}
